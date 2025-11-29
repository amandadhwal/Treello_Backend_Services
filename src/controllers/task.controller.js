import Task from '../model/Task.js'
import Team from '../model/Team.js'
import mongoose from "mongoose";
export const createTask = async (req, res, next) => {
    try {
      const { teamId } = req.params;
      const { title, description, assignedTo, dueDate } = req.body;
  
      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is required"
        });
      }
  
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({
          success: false,
          message: "Team not found"
        });
      }
  
      const newTask = await Task.create({
        teamId,
        title,
        description,
        assignedTo: assignedTo || null,  // must be valid ObjectId if present
        dueDate: dueDate || null,
        createdBy: req.user.id,
        status: "TODO"
      });
  
      return res.status(201).json({
        success: true,
        task: newTask
      });
  
    } catch (error) {
      console.error("CREATE TASK ERROR:", error.message);  // log actual error
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  };

  export const updateTask = async (req, res, next) => {
    try {
      const { teamId, taskId } = req.params;
      const { title, description, assignedTo, dueDate } = req.body;
  
      const task = await Task.findOne({ _id: taskId, teamId });
      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found"
        });
      }
  
      // Optional: track previous values
      const prev = {
        status: task.status,
        assignedTo: task.assignedTo
      };
  
      // Update only allowed fields
      if (title) task.title = title;
      if (description) task.description = description;
      if (assignedTo) task.assignedTo = assignedTo;
      if (dueDate) task.dueDate = dueDate;
  
      await task.save();
  
      return res.status(200).json({
        success: true,
        message: "Task updated successfully",
        task,
        previous: prev
      });
  
    } catch (error) {
      next(error);
    }
  };
  

  export const deleteTask = async (req, res, next) => {
    try {
      const { teamId, taskId } = req.params;
  
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(taskId) || !mongoose.Types.ObjectId.isValid(teamId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid teamId or taskId"
        });
      }
  
      const task = await Task.findOne({ _id: taskId, teamId });
      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found"
        });
      }
  
      await task.deleteOne();
  
      return res.status(200).json({
        success: true,
        message: "Task deleted successfully"
      });
  
    } catch (error) {
      next(error);
    }
  };

  export const updateStatus = async (req, res, next) => {
    try {
      const { teamId, taskId } = req.params; // from URL
      const { newStatus } = req.body;        // from body
  
      if (!newStatus) {
        return res.status(400).json({
          success: false,
          message: "newStatus is required"
        });
      }
  
      const allowed = ["TODO", "DOING", "DONE"];
      if (!allowed.includes(newStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status value"
        });
      }
  
      // Validate ObjectIds
      if (!mongoose.Types.ObjectId.isValid(teamId) || !mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid teamId or taskId"
        });
      }
  
      // Fetch task
      const task = await Task.findOne({ _id: taskId, teamId });
      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found"
        });
      }
  
      // Update status
      task.status = newStatus;
      await task.save();
  
      return res.status(200).json({
        success: true,
        message: "Task status updated successfully",
        task
      });
  
    } catch (error) {
      next(error);
    }
  };
  

  export const addComment = async (req, res, next) => {
    try {
        const { teamId, taskId } = req.params; // params from route
        const { text } = req.body;

        // validate input
        if (!text || !req.user?.id) {
            return res.status(400).json({
                success: false,
                message: "Comment text and user are required"
            });
        }

        // find task
        const task = await Task.findOne({ _id: taskId, teamId });
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        // initialize comments array if undefined
        if (!Array.isArray(task.comments)) task.comments = [];

        // create comment
        const newComment = {
            text,
            createdBy: req.user.id, // must exist
            createdAt: new Date()
        };

        task.comments.push(newComment);
        await task.save();

        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment: newComment
        });
    } catch (error) {
        next(error);
    }
};

