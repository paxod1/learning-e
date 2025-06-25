const verifyToken = require('../TokenVerification');
const db = require('../config/db');
var router = require('express').Router()


// get student personl details
router.get('/getstudent', verifyToken, async (req, res) => {
    const { pro_stud_id } = req.query;

    try {
        const query = 'SELECT * FROM tbl_project_student WHERE pro_stud_id = ?';
        var [results3] = await db.query(query, [pro_stud_id])
        console.log(pro_stud_id);
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
        console.log(results4);
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
        console.log(results4);
        res.status(200).json(results4)

    } catch (err) {
        console.error("Query execution error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});


// get attendance router
router.get('/getdataattendance', verifyToken, async (req, res) => {
    const { training_id, year, month } = req.query;

    if (!training_id) {
        return res.status(400).json('training_id is required');
    }
    const parsedStudentId = parseInt(training_id);
    if (isNaN(parsedStudentId)) {
        return res.status(400).json('Invalid training_id');
    }
    console.log(parsedStudentId);

    let query = 'SELECT * FROM tbl_project_attendance WHERE project_id = ?';
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
    console.log(id, group);

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
        console.log("videos", results);

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
    console.log("Material query params:", id, group);

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
    console.log("hi");

    const { id, group } = req.query;
    console.log("Announcement query params:", id, group);

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
        console.log(results);

        if (results.length === 0) {
            return res.status(404).json('No announcements found');
        }
        return res.status(200).json(results);
    } catch (err) {
        console.error("Query execution error:", err.message);
        return res.status(500).json({ error: err.message });
    }
});



module.exports = router