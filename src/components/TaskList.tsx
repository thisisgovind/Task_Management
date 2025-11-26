import TaskCard from './TaskCard'
import type { Task } from '../features/tasks/types'

type TaskListProps = {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

const TaskList = ({ tasks, onEdit, onDelete }: TaskListProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default TaskList

