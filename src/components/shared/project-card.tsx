interface ProjectCardProps {
  project: {
    id: number | string
    name: string
    client?: string
    progress: number
    status: string
    timeToday?: string
    tasksCompleted?: number
    totalTasks?: number
    priority?: string
  }
  onClick?: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours':
        return 'bg-green-100 text-green-800'
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div 
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <h4 className="text-sm font-medium text-gray-900">{project.name}</h4>
          {project.priority && (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
              {project.priority === 'high' ? 'Haute' : project.priority === 'medium' ? 'Moyenne' : 'Basse'}
            </span>
          )}
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>
      
      {project.client && (
        <p className="text-sm text-gray-500 mb-3">Client: {project.client}</p>
      )}
      
      <div className="grid grid-cols-2 gap-4 mb-3 text-sm text-gray-600">
        {project.timeToday && (
          <div>Temps aujourd'hui: <span className="font-medium">{project.timeToday}</span></div>
        )}
        <div>Progression: <span className="font-medium">{project.progress}%</span></div>
        {project.tasksCompleted !== undefined && project.totalTasks && (
          <div>Tâches: <span className="font-medium">{project.tasksCompleted}/{project.totalTasks}</span></div>
        )}
        <div>Statut: <span className="font-medium">{project.status}</span></div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progression</span>
          <span>{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}