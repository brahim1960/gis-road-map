import { Clock, Calendar, Award, BarChart3, Activity } from 'lucide-react'

interface ActivityItem {
  id: number
  user: string
  action: string
  time: string
  avatar: string
  type: string
  location: string
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  title?: string
}

export function ActivityFeed({ activities, title = "Activité récente" }: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'checkin':
        return <Clock className="h-4 w-4 text-green-500" />
      case 'task':
        return <Calendar className="h-4 w-4 text-blue-500" />
      case 'badge':
        return <Award className="h-4 w-4 text-yellow-500" />
      case 'report':
        return <BarChart3 className="h-4 w-4 text-purple-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <div className="p-6">
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, activityIdx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== activities.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                        {activity.avatar}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">{activity.user}</span>{' '}
                          {activity.action}
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        {activity.time}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}