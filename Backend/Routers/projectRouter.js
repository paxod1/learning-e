const verifyToken = require('../TokenVerification');
const db = require('../config/db');
var router = require('express').Router()


// get student personl details
router.get('/getstudent', verifyToken, async (req, res) => {
    const { pro_stud_id } = req.query;

    try {
        const query = 'SELECT * FROM tbl_project_student WHERE pro_stud_id = ?';
        var [results3] = await db.query(query, [pro_stud_id])
        res.status(200).json(results3)

    } catch (err) {
        console.error("Query execution error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});
// get group details
router.get('/getGroupDetails', async (req, res) => {
    const { project_id } = req.query;

    try {
        const querytofindTrainingIds = 'SELECT * FROM tbl_project WHERE project_id = ?';
        var [results4] = await db.query(querytofindTrainingIds, project_id);
        res.status(200).json(results4)

    } catch (err) {
        console.error("Query execution error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});

// get bill details
router.get('/getBillDetails', verifyToken, async (req, res) => {
    const { project_id } = req.query;

    try {
        const querytofindTrainingIds = 'SELECT * FROM tbl_project_bill WHERE project_id = ?';
        var [results4] = await db.query(querytofindTrainingIds, project_id);
        res.status(200).json(results4)

    } catch (err) {
        console.error("Query execution error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});


// get attendance router
router.get('/getdataattendance', verifyToken, async (req, res) => {
    const { pro_stud_id, year, month } = req.query;

    if (!pro_stud_id) {
        return res.status(400).json('training_id is required');
    }
    const parsedStudentId = parseInt(pro_stud_id);
    if (isNaN(parsedStudentId)) {
        return res.status(400).json('Invalid training_id');
    }
    console.log(parsedStudentId);

    let query = 'SELECT * FROM tbl_project_attendance WHERE pro_stud_id = ?';
    let queryParams = [parsedStudentId];
    if (year && month) {
        query += ' AND YEAR(date_taken) = ? AND MONTH(date_taken) = ?';
        queryParams.push(year, month);
    } else {
        console.log('Filtering without specific year/month');
    }
    try {
        const [results] = await db.query(query, queryParams);
        if (results.length === 0) {
            return res.status(404).json('No attendance data found');
        }
        return res.status(200).json(results);
    } catch (err) {
        console.error("Query execution error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});

// get videos

router.get('/getdatavideos', verifyToken, async (req, res) => {
    const { id, group } = req.query;

    let query = '';
    let param = '';

    if (id) {
        query = 'SELECT * FROM tbl_project_video WHERE ref_id = ?';
        param = id;
    } else if (group) {
        query = 'SELECT * FROM tbl_project_video WHERE ref_id = ?';
        param = group;
    } else {
        return res.status(400).json('Either "id" or "group" is required');
    }
    try {
        const [results] = await db.query(query, [param]);

        if (results.length === 0) {
            return res.status(404).json('No videos found');
        }
        return res.status(200).json(results);
    } catch (err) {
        console.error("Query execution error:", err.message);
        return res.status(500).json({ error: err.message });
    }
})
// study material
router.get('/getdatamaterial', verifyToken, async (req, res) => {
    const { id, group } = req.query;

    let query = '';
    let param = '';

    if (id) {
        query = 'SELECT * FROM tbl_project_material WHERE ref_id = ?';
        param = id;
    } else if (group) {
        query = 'SELECT * FROM tbl_project_material WHERE ref_id = ?';
        param = group;
    } else {
        return res.status(400).json('Either "id" or "group" is required');
    }

    try {
        const [results] = await db.query(query, [param]);
        if (results.length === 0) {
            return res.status(404).json('No study material found');
        }
        return res.status(200).json(results);
    } catch (err) {
        console.error("Query execution error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});

// mail router
router.get('/getdataAnnouncementsid', verifyToken, async (req, res) => {
  

    const { id, group } = req.query;
    let query = '';
    let param = '';

    if (id) {
        query = 'SELECT * FROM tbl_project_mailbox WHERE ref_id = ?';
        param = id;
    } else if (group) {
        query = 'SELECT * FROM tbl_project_mailbox WHERE ref_id = ?';
        param = group;
    } else {
        return res.status(400).json('Either "id" or "group" is required');
    }

    try {
        const [results] = await db.query(query, [param]);

        if (results.length === 0) {
            return res.status(404).json('No announcements found');
        }
        return res.status(200).json(results);
    } catch (err) {
        console.error("Query execution error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});




// get earinig
router.get('/earnings', async (req, res) => {
    const { pro_stud_id } = req.query;

    if (!pro_stud_id) {
        return res.status(400).json({ error: 'pro_stud_id is required' });
    }

    try {
        const [rows] = await db.query(
            'SELECT SUM(earnings) AS total_earnings FROM tbl_project_reference WHERE pro_stud_id = ?',
            [pro_stud_id]
        );
        res.json({ total_earnings: rows[0].total_earnings || 0 });
    } catch (error) {
        console.error('Error fetching earnings:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// add reference data
router.post('/addreferencedata', verifyToken, async (req, res) => {

    const {
        ref_name,
        ref_email,
        ref_contact,
        earnings,
        pro_stud_id,
        project_id
    } = req.body;


    // Validation
    if (project_id == undefined ||
        pro_stud_id === undefined ||
        !ref_name ||
        !ref_email ||
        !ref_contact ||
        earnings === undefined
    ) {
        return res.status(400).json('All fields are required');
    }

    const parsedpro_stud_id = parseInt(pro_stud_id);
    const parsedproject_id = parseInt(project_id);
    const parsedEarnings = parseFloat(earnings);

    if (isNaN(parsedproject_id) || isNaN(parsedpro_stud_id) || isNaN(parsedEarnings)) {
        return res.status(400).json('Invalid training_id, student_id, or earnings');
    }

    const query = `
    INSERT INTO tbl_project_reference (pro_stud_id, project_id, ref_name, ref_email, ref_contact, earnings)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

    try {

        const [result] = await db.query(query, [
            parsedpro_stud_id,
            parsedproject_id,
            ref_name,
            ref_email,
            ref_contact,
            parsedEarnings
        ]);

        return res.status(200).json({ message: 'Reference data saved successfully' });
    } catch (err) {
        console.error("Database insert error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});

// change password
router.post('/change-password', verifyToken, async (req, res) => {
    const { pro_stud_id, currentPassword, newPassword } = req.body;
    if (!pro_stud_id || !currentPassword || !newPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const query = 'SELECT * FROM tbl_project_student WHERE pro_stud_id = ?';
        var [results3] = await db.query(query, [pro_stud_id])
        var email = results3[0].email
        if (results3) {
            const [results] = await db.query('SELECT * FROM tbl_login WHERE username = ?', [email]);
            if (results.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            const user = results[0];


            if (currentPassword !== user.password) {
                return res.status(401).json({ message: 'Current password is incorrect' });
            }
            await db.query('UPDATE tbl_login SET password = ? WHERE username = ?', [newPassword, email]);
            return res.status(200).json({ message: 'Password updated successfully' });

        } else {
            res.status(404).json('not found data')
        }

    } catch (err) {

        console.error('Error updating password:', err);
        return res.status(500).json({ error: 'Database error' });
    }
});


// add file and doc
const ftp = require("basic-ftp");
const multer = require('multer');

// Multer configuration for handling multiple files
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 500 * 1024 * 1024, // 500MB limit for each file
        files: 2 // Maximum 2 files (project and documentation)
    }
});

// FTP Upload Function
async function uploadToFTP(fileBuffer, filename) {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "ftp.techwingsys.com",
            user: "test2@techwingsys.com",
            password: "9995400671@Test2",
            secure: false
        });

        try {
            await client.ensureDir("billtws/uploads/project");
        } catch (dirError) {
            console.log("Directory already exists or couldn't be created");
        }

        const stream = require('stream');
        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileBuffer);

        await client.uploadFrom(bufferStream, filename);
        console.log("File uploaded to FTP!");
        return true;
    } catch (err) {
        console.error("FTP upload failed:", err);
        throw err;
    } finally {
        client.close();
    }
}

// Project Submission Route
router.post('/submit-project', verifyToken, upload.fields([
    { name: 'projectFile', maxCount: 1 },
    { name: 'documentationFile', maxCount: 1 }
]), async (req, res) => {
    const { project_id, pro_stud_id } = req.body;

    if (!project_id, !pro_stud_id) {
        return res.status(400).json({ message: 'Project ID and pro_stud_id is required' });
    }

    try {
        // Upload files to FTP
        let projectFileName = null;
        let documentationFileName = null;
        const timestamp = Date.now();

        if (req.files.projectFile) {
            projectFileName = `project_${project_id}_${timestamp}_${req.files.projectFile[0].originalname}`;
            await uploadToFTP(req.files.projectFile[0].buffer, projectFileName);
        }

        if (req.files.documentationFile) {
            documentationFileName = `doc_${project_id}_${timestamp}_${req.files.documentationFile[0].originalname}`;
            await uploadToFTP(req.files.documentationFile[0].buffer, documentationFileName);
        }

        // Save submission record to DB
        const submissionQuery = `
    INSERT INTO tbl_project_upload
    (project_id, project_file, project_doc, pro_stud_id, upload_date) 
    VALUES (?, ?, ?, ?, NOW())
`;


        const [submissionResult] = await db.query(submissionQuery, [
            project_id,
            projectFileName,
            documentationFileName,
            pro_stud_id
        ]);

        res.status(201).json({
            message: 'Project submitted successfully',
            submissionId: submissionResult.insertId
        });

    } catch (err) {
        console.error('Project submission error:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ message: 'Each file must be less than 500MB' });
        }
        res.status(500).json({ message: 'Failed to submit project', error: err.message });
    }
});

module.exports = router