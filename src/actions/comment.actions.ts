'use server';

import { auth } from '@/auth';
import { connectDb } from '@/dbConfig/dbConfig';
import Comment from '@/models/comment.model';
import Task from '@/models/task.model';
import { revalidatePath } from 'next/cache';

interface CommentActionResponse {
  success: boolean;
  message: string;
}

export async function addCommentAction(
  taskId: string,
  projectId: string,
  commentText: string
): Promise<CommentActionResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Unauthorized: Please log in',
      };
    }

    // Validate comment text
    if (!commentText || commentText.trim().length === 0) {
      return {
        success: false,
        message: 'Comment cannot be empty',
      };
    }

    await connectDb();

    // Verify task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return {
        success: false,
        message: 'Task not found',
      };
    }

    // Create the comment
    const newComment = await Comment.create({
      comment: commentText.trim(),
      createdBy: session.user.id,
    });

    // Add comment to task
    await Task.findByIdAndUpdate(taskId, {
      $push: { comments: newComment._id },
    });

    // Revalidate the task detail page
    revalidatePath(`/projects/${projectId}/tasks/${taskId}`);

    return {
      success: true,
      message: 'Comment added successfully',
    };
  } catch (error) {
    console.error('Error in addCommentAction:', error);
    return {
      success: false,
      message: 'Failed to add comment',
    };
  }
}
