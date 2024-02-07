<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'status' => 'required|in:complete,processing,pending',
            'limit_date' => 'nullable|date',
            'priority' => 'required|boolean',
        ]);

        $user = auth()->user();

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category,
            'status' => $request->status,
            'limit_date' => $request->limit_date,
            'priority' => $request->priority,
            'user_id' => $user->id,
        ]);

        return response()->json(['task' => $task, 'message' => 'Task created successfully'], 201);
    }
    public function getTasks()
    {
        $user = auth()->user();
        $tasks = Task::where('user_id', $user->id)->get();

        return response()->json(['tasks' => $tasks]);
    }
}
