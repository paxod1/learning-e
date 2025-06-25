import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TokenRequest } from '../AxiosCreate';
import './Aptitude.css';
import { Link } from "react-router-dom"
import Swal from 'sweetalert2';


function Aptitude() {
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [months, setMonths] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState([]);
    const [completedTests, setCompletedTests] = useState({});
    const [examStatus, setExamStatus] = useState(null); // 'before', 'during', 'after'
    const [currentExamTime, setCurrentExamTime] = useState(null);

    const logininfom = useSelector((state) => state.userlogin?.LoginInfo[0]);
    var id = logininfom.selectedTrainingId ? logininfom.selectedTrainingId : logininfom.trainingIdArray[0]
    console.log(id);

    const monthNames = {
        '01': 'January', '02': 'February', '03': 'March', '04': 'April',
        '05': 'May', '06': 'June', '07': 'July', '08': 'August',
        '09': 'September', '10': 'October', '11': 'November', '12': 'December'
    };

    const checkExamTime = (examDate, startTime, endTime) => {
        const now = new Date();
        const examDateTime = new Date(examDate);

        // Parse start and end times
        const [startHours, startMinutes, startSeconds] = startTime.split(':').map(Number);
        const [endHours, endMinutes, endSeconds] = endTime.split(':').map(Number);

        // Set start and end times on exam date
        const examStartTime = new Date(examDateTime);
        examStartTime.setHours(startHours, startMinutes, startSeconds);

        const examEndTime = new Date(examDateTime);
        examEndTime.setHours(endHours, endMinutes, endSeconds);

        // Check current time against exam window
        if (now < examStartTime) {
            return { status: 'before', startTime: examStartTime };
        } else if (now >= examStartTime && now <= examEndTime) {
            return { status: 'during', endTime: examEndTime };
        } else {
            return { status: 'after' };
        }
    };

    async function fetchQuestions() {
        setLoading(true);

        let batchName = '';
        let data = [];
        let reviewData = [];

        // Month name to number mapping
        const monthNameToNumber = {
            'january': '01',
            'february': '02',
            'march': '03',
            'april': '04',
            'may': '05',
            'june': '06',
            'july': '07',
            'august': '08',
            'september': '09',
            'october': '10',
            'november': '11',
            'december': '12'
        };

        // 1. Fetch batch name
        try {
            const batchData = await TokenRequest.get(`/student/getdatatraining?training_id=${id}`);
            batchName = batchData.data[0]?.batch || '';
        } catch (err) {
            console.error("Failed to fetch training data:", err);
        }

        // 2. Fetch aptitude questions
        try {
            if (batchName) {
                const res = await TokenRequest.get(`/student/getAptitude?batchname=${batchName}`);
                data = res.data;
                console.log("Aptitude questions:", data);
                setQuestions(data);
                const uniqueMonths = [...new Set(data.map(q => q.month))];
                setMonths(uniqueMonths);
            }
        } catch (err) {
            console.error("Failed to fetch aptitude questions:", err);
        }

        // 3. Fetch review data
        try {
            const reviewResponse = await TokenRequest.get(`/student/getdatareview?student_id=${logininfom.student_id}`);
            reviewData = reviewResponse.data;
            console.log("Review data:", reviewData);
        } catch (err) {
            console.error("Failed to fetch review data:", err);
        }

        // 4. Process completed tests
        try {
            const completedData = {};

            reviewData.forEach(item => {
                if (item.aptitude && item.month) {
                    const monthLower = item.month.toLowerCase().trim();
                    const monthNum = monthNameToNumber[monthLower];

                    if (monthNum && data.length > 0) {
                        data.forEach(q => {
                            if (q.month) {
                                const [year, qMonth] = q.month.split('-');
                                if (qMonth === monthNum) {
                                    completedData[q.month] = item.aptitude;
                                }
                            }
                        });
                    }
                }
            });

            console.log("Completed tests:", completedData);
            setCompletedTests(completedData);
        } catch (err) {
            console.error("Failed to process completed tests:", err);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchQuestions()
    }, [id])

    const handleMonthSelect = (month) => {
        const selectedExam = questions.find(q => q.month === month);
        if (selectedExam) {
            const timeCheck = checkExamTime(
                selectedExam.exam_date,
                selectedExam.start_time,
                selectedExam.end_time
            );

            setExamStatus(timeCheck.status);
            setCurrentExamTime({
                start: timeCheck.startTime,
                end: timeCheck.endTime
            });

            if (timeCheck.status === 'during') {
                setSelectedMonth(month);
                setAnswers({});
                setShowResult(false);
                setWrongAnswers([]);
            }
        }
    };

    const handleOptionChange = (questionId, selectedOption) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: selectedOption
        }));
    };

    const handleSubmit = async () => {
        const filtered = questions.filter(q => q.month === selectedMonth);
        let total = 0;
        const wrong = [];

        filtered.forEach(q => {
            if (answers[q.question_id] === q.answer) {
                total += q.mark;
            } else if (answers[q.question_id]) {
                wrong.push({
                    questionId: q.question_id,
                    question: q.question,
                    correctAnswer: q.answer,
                    correctAnswerText: q[`option_${q.answer.toLowerCase()}`],
                    yourAnswer: answers[q.question_id],
                    yourAnswerText: q[`option_${answers[q.question_id].toLowerCase()}`],
                    explanation: q.explanation || '',
                });
            }
        });

        setScore(total);
        setWrongAnswers(wrong);
        setShowResult(true);

        try {
            // Extract month name from selectedMonth (assuming format is YYYY-MM)
            const [year, monthNum] = selectedMonth.split('-');
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
            const monthName = monthNames[parseInt(monthNum) - 1];
            console.log(logininfom.student_id);
            console.log(total);
            console.log(monthName);

            const response = await TokenRequest.post('/student/addaptitudemark', {
                student_id: logininfom.student_id,
                aptitude: total,
                month: monthName,
                training_id: id
            });
            console.log('Aptitude mark saved successfully:', response.data);
            fetchQuestions()
        } catch (err) {
            console.error('Failed to save aptitude mark:', err);
        }
    };

    const filteredQuestions = questions.filter(q => q.month === selectedMonth);
    const totalPossibleScore = filteredQuestions.reduce((sum, q) => sum + q.mark, 0);
    const formattedMonth = selectedMonth ? `${monthNames[selectedMonth.split('-')[1]]} ${selectedMonth.split('-')[0]}` : '';

    const formatTime = (date) => {
        if (!date) return '';
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
    };

    useEffect(() => {
        if (examStatus === 'before' && currentExamTime?.start) {
            Swal.fire({
                icon: 'info',
                title: 'Exam Not Started Yet',
                html: `
        <p>The exam will be available on:</p>
        <p><strong>Date:</strong> ${formatDate(currentExamTime.start)}<br/>
        <strong>Time:</strong> ${formatTime(currentExamTime.start)}</p>
      `,
                confirmButtonText: '← Back to All Tests'
            }).then(() => {
                setExamStatus(null);
            });
        }

        if (examStatus === 'after') {
            Swal.fire({
                icon: 'warning',
                title: 'Exam Time Expired',
                text: 'The exam time window has ended.',
                confirmButtonText: '← Back to All Tests'
            }).then(() => {
                setExamStatus(null);
            });
        }
    }, [examStatus, currentExamTime]);


    return (
        <div className="aptitude-container">
            <h2 className="aptitude-title">Aptitude Test</h2>

            {loading && <div className="loading-spinner">Loading...</div>}

            {!loading && !selectedMonth && (
                <div className="month-selection-section">
                    <h3>Select Test Month</h3>
                    {months.length === 0 ? (
                        <div className="no-tests-available">
                            <p>No aptitude tests are available at the moment.</p>
                            <Link to="/" className="home-btn">
                                🏠 Return to Home
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="month-grid">
                                {months.map((month, idx) => {
                                    const [year, monthNum] = month.split('-');
                                    const monthName = monthNames[monthNum] || monthNum;
                                    const isCompleted = completedTests[month] !== undefined;
                                    const examData = questions.find(q => q.month === month);

                                    return (
                                        <div
                                            key={idx}
                                            className={`month-box ${isCompleted ? 'completed' : ''}`}
                                            onClick={() => !isCompleted && handleMonthSelect(month)}
                                        >
                                            <div className="month-icon">
                                                <span className="month-abbr">{monthName.substring(0, 3)}</span>
                                                {isCompleted && <span className="completed-badge">✓</span>}
                                            </div>
                                            <div className="month-details">
                                                <span className="month-name">{monthName}</span>
                                                <span className="month-year">{year}</span>
                                                {examData && (
                                                    <span className="exam-time">
                                                        {formatTime(new Date(`1970-01-01T${examData.start_time}`))} - {formatTime(new Date(`1970-01-01T${examData.end_time}`))}
                                                    </span>
                                                )}
                                                {isCompleted && (
                                                    <span className="month-score">Score: {completedTests[month]}</span>
                                                )}
                                            </div>
                                            {isCompleted && (
                                                <div className="completed-overlay">
                                                    Test Completed
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="month-selection-actions">
                                <Link to="/" className="home-btn">
                                    🏠 Return to Home
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            )}

            {selectedMonth && examStatus === 'during' && (
                <div className="test-section">
                    <div className="test-header">
                        <h3>Aptitude Test - {formattedMonth}</h3>
                        <div className="exam-time-remaining">
                            Time remaining: {formatTime(currentExamTime.end)}
                        </div>
                        {!showResult && (
                            <button
                                className="back-btn"
                                onClick={() => {
                                    setSelectedMonth('');
                                    setShowResult(false);
                                    setExamStatus(null);
                                }}
                            >
                                ← Back to Months
                            </button>
                        )}
                    </div>

                    {!showResult && filteredQuestions.length > 0 && (
                        <div className="questions-section">
                            {filteredQuestions.map((q, index) => (
                                <div key={q.question_id} className="question-box">
                                    <p className="question-text">
                                        <span className="question-number">{index + 1}.</span>
                                        {q.question}
                                        <span className="question-mark"> [Marks: {q.mark}]</span>
                                    </p>
                                    <div className="options">
                                        {['A', 'B', 'C', 'D'].map(opt => {
                                            const optionText = q[`option_${opt.toLowerCase()}`];
                                            if (!optionText) return null;

                                            return (
                                                <label key={opt} className="option-label">
                                                    <input
                                                        type="radio"
                                                        name={`q${q.question_id}`}
                                                        value={opt}
                                                        checked={answers[q.question_id] === opt}
                                                        onChange={() => handleOptionChange(q.question_id, opt)}
                                                    />
                                                    <span className="option-letter">{opt}.</span>
                                                    <span className="option-text">{optionText}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            <button
                                className="submit-btn"
                                onClick={handleSubmit}
                                disabled={Object.keys(answers).length < filteredQuestions.length}
                            >
                                Submit Answers
                            </button>
                        </div>
                    )}

                    {showResult && (
                        <div className="result-section">
                            <div className={`result-box ${score >= totalPossibleScore * 0.5 ? 'pass' : 'fail'}`}>
                                <h3>Test Result</h3>
                                <div className="score-display">
                                    <div className="score-circle">
                                        <span className="score-value">{score}</span>
                                        <span className="score-total">/{totalPossibleScore}</span>
                                    </div>
                                    <div className="score-percentage">
                                        {Math.round((score / totalPossibleScore) * 100)}%
                                    </div>
                                </div>
                                <div className="result-message">
                                    {score >= totalPossibleScore * 0.5 ? (
                                        <span className="pass-message">Congratulations! You passed the test.</span>
                                    ) : (
                                        <span className="fail-message">Keep practicing! You'll do better next time.</span>
                                    )}
                                </div>
                            </div>
                            {wrongAnswers.length > 0 && (
                                <div className="wrong-answers">
                                    <h4>Questions to Review:</h4>
                                    {wrongAnswers.map((item, idx) => (
                                        <div key={idx} className="wrong-answer-item">
                                            <p className="wrong-question">
                                                <span className="wrong-q-number">{idx + 1}.</span>
                                                {item.question}
                                            </p>

                                            <div className="answer-comparison">
                                                <div className="answer-section correct-section">
                                                    <div className="answer-header">
                                                        <span>Correct Answer:</span>
                                                        <strong className="correct">{item.correctAnswer}. {item.correctAnswerText}</strong>
                                                    </div>

                                                </div>

                                                <div className="answer-section your-section">
                                                    <div className="answer-header">
                                                        <span>Your Answer:</span>
                                                        <strong className="wrong">{item.yourAnswer}. {item.yourAnswerText}</strong>
                                                    </div>

                                                </div>
                                            </div>

                                            {item.explanation && (
                                                <div className="explanation">
                                                    <span>Explanation:</span>
                                                    <p>{item.explanation}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="result-actions">
                                <button
                                    className="back-btn"
                                    onClick={() => {
                                        setSelectedMonth('');
                                        setShowResult(false);
                                        setExamStatus(null);
                                    }}
                                >
                                    ← Back to All Tests
                                </button>

                                <Link to="/" className="home-btn">
                                    🏠 Return to Home
                                </Link>
                            </div>
                        </div>
                    )}

                    {selectedMonth && !showResult && filteredQuestions.length === 0 && (
                        <div className="no-questions">
                            <p>No questions available for this month.</p>
                            <button
                                className="back-btn"
                                onClick={() => {
                                    setSelectedMonth('');
                                    setExamStatus(null);
                                }}
                            >
                                ← Back to Months
                            </button>
                            <Link to="/" className="home-btn">
                                🏠 Return to Home
                            </Link>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}

export default Aptitude;