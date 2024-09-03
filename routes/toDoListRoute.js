const express = require('express');
const toDoListController = require('../controllers/toDoListController');

const router = express.Router();
router.get('/about', toDoListController.toDoList_about);
router.get('/', toDoListController.toDoList_index);
router.get('/create', toDoListController.toDoList_create);
router.get('/:id', toDoListController.toDoList_details);
router.post('/create', toDoListController.upload.array('attachments', 5), toDoListController.toDoList_create_post);
router.delete('/delete/:id', toDoListController.toDoList_delete);
router.get('/category/:id', toDoListController.toDoList_findByCategory);
router.get('/edit/:id', toDoListController.toDoList_edit);
router.post('/edit/:id', toDoListController.upload.array('attachments', 5), toDoListController.toDoList_edit_task);

module.exports = router;
