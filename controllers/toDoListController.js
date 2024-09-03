
const Task = require('../models/task');
const Category = require('../models/category');
const Comment = require('../models/comment');
const Attachment = require('../models/attachment');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { ObjectId } = require('mongodb');

// Get all categories
const get_all_categories = async () => {
  try {
    const categories = await Category.find();
    return categories;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

// Get all tasks
const toDoList_index = async (req, res) => {
  const categories = await get_all_categories();
    await Task.find()
    .sort({createdAt: -1})
    .populate('comments')
    .populate('attachments')
    .then(tasks => {
        res.render('index', {title: 'Home', tasks, categories});
    }).catch(e => console.log(e));
}

//Get the Details of a Specific Task
const toDoList_details = async (req, res) => {
    const id = req.params.id;
    const categories = await get_all_categories();
    await Task.findById(id)
    .populate('comments')
    .populate('attachments')
    .populate('category')
    .then((task) => {
        res.render('details', {title: 'Task Details', task, categories  });
    })
    .catch((err)=>{
        console.log(err);
        res.status(404).render('404', {title: 'Task not found'});
    })
}

//Render form to create new task
const toDoList_create = async (req, res) => {
    const categories = await get_all_categories();
    await Category.find()
    .then(tasks => {
        res.render('create', {title: 'New Task', categories, categories});
    }).catch(e => console.log(e));
}

//Save new task to database
const toDoList_create_post = async (req, res) => {

    const { title, description, dueDate, priority, status, assignee, category } = req.body;
    
     // Handle attachments
     const attachmentIds = [];
     if (req.files) {
         for (const file of req.files) {
            upload.single('file');
             const attachment = new Attachment({ link: file.filename});
             await attachment.save();
             attachmentIds.push(attachment._id);       
         }
     }

       // Create task
       const task = new Task({
        title,
        description,
        dueDate,
        priority,
        status,
        assignee,
        category,
        attachments: attachmentIds
    });

    task.save()
        .then((result) => {
            res.redirect('/');
        })
        .catch((err)=>{
            console.log(err);
        });
}

const attachmentsDir = 'attachments';

// Check if the directory exists
if (!fs.existsSync(attachmentsDir)) {
  // Create the directory if it doesn't exist
  fs.mkdirSync(attachmentsDir, { recursive: true });
}

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, attachmentsDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext);
    },
  });
  
  const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
  
      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb(new Error('Only image files are allowed.'));
      }
    },
    limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB
  });  

//Delete a task from database
const toDoList_delete = (req, res) => {
  const id = req.params.id; 

  Task.findById(id)
  .populate('attachments')
  .then(result => {
    result.attachments.forEach(attachment => {
      fs.unlink(`./attachments/${attachment.link}`, (err) => {
        console.log(err);
      });
    });
  });

  Task.findByIdAndDelete(id)
  .then((result) => {
      res.json({redirect: '/'});
  })
  .catch((err)=>{console.log(err)});
}

// Find tasks by category id
const toDoList_findByCategory = async (req, res) => {
  const { id } = req.params;

  const categories = await get_all_categories();

  await Task.find({category: new ObjectId(id)})
  .populate('comments')
  .populate('attachments')
  .populate('category')
  .then((tasks) => {
    res.render('category', {title: 'Category', tasks, categories});
  })
  .catch((err)=>{
      console.log(err);
  }) 
}

const toDoList_about = async (req, res) => {
  const categories = await get_all_categories();
  res.render('about', {title: 'About', categories});
}


//Display task to be edited
const toDoList_edit = async (req, res) => {
  const id = req.params.id; 
  const categories = await get_all_categories();

  await Task.findById(id)
  .populate('comments')
  .populate('attachments')
  .populate('category')
  .then((task) => {
      res.render('edit', {title: "Edit Task", task, categories});
  })
  .catch((err)=>{console.log(err)});
}

//Edit task
const toDoList_edit_task = async (req, res) => {
  const id = req.params.id; 

  // Remove previously uploaded attachments
  Task.findById(id)
  .populate('attachments')
  .then(result => {
    result.attachments.forEach(attachment => {
      fs.unlink(`./attachments/${attachment.link}`, (err) => {
        console.log(err);
      });
    });
  });

  const { title, description, dueDate, priority, status, assignee, category } = req.body;
    
  // Handle attachments
  const attachmentIds = [];
  if (req.files) {
      for (const file of req.files) {
         upload.single('file');
          const attachment = new Attachment({ link: file.filename});
          await attachment.save();
          attachmentIds.push(attachment._id);       
      }
  }

    // Task to be updated from database
    const task = {
     title,
     description,
     dueDate,
     priority,
     status,
     assignee,
     category,
     attachments: attachmentIds
 };

 await Task.findByIdAndUpdate(req.params.id, task)
 .then(result => res.redirect('/'))
 .catch(err => console.log(err));
}

module.exports = {
    toDoList_index,
    toDoList_create,
    toDoList_details,
    toDoList_create_post,
    toDoList_delete,
    toDoList_findByCategory,
    toDoList_about,
    toDoList_edit,
    toDoList_edit_task,
    storage,
    upload
}