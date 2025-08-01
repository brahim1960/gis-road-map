// pro2/src/app/admin/chat/page.tsx
'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '../../../components/ui/dashboard-layout'
import { useAuth } from '../../../hooks/useAuth'
import { adminNavigation } from '@/components/ui/admin-navigation'
import { getSupabaseClient } from '../../../lib/supabase/client'
import { PlusCircle, Clock, Calendar, MessageSquare, User, Check, X } from 'lucide-react'

// Types étendus pour les nouvelles fonctionnalités
interface ChatRoom {
  id: string
  name: string
  description?: string | null
  is_private: boolean
  last_message_at?: string
  created_by: string
}

interface ChatMessage {
  id: string
  room_id: string
  sender_id: string
  content: string
  created_at: string
  updated_at: string
  is_edited: boolean
  reply_to?: {
    id: string
    content: string
    sender_id: string
  }
}

interface UserProfile {
  id: string
  username: string
  avatar_url?: string
}

const CreateRoomModal = ({ 
  isOpen, 
  onClose, 
  onCreate 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onCreate: (name: string, isPrivate: boolean) => void 
}) => {
  const [roomName, setRoomName] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)

  if (!isOpen) return null

  const handleCreate = () => {
    if (roomName.trim()) {
      onCreate(roomName.trim(), isPrivate)
      setRoomName('')
      setIsPrivate(false)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Créer un nouveau salon</h2>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Nom du salon"
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
        />
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="private-room"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="private-room">Salon privé</label>
        </div>
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Annuler
          </button>
          <button 
            onClick={handleCreate} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Créer
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  const { user } = useAuth()
  const supabase = getSupabaseClient()

  // States
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [participants, setParticipants] = useState<Record<string, UserProfile>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Fetch chat rooms with last message info
  const fetchRooms = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('chat_rooms')
      .select('*')
      .order('last_message_at', { ascending: false })

    if (!error) {
      setRooms(data as ChatRoom[])
      // Select first room by default if none selected
      if (data.length > 0 && !currentRoom) {
        setCurrentRoom(data[0] as ChatRoom)
      }
    }
    setIsLoading(false)
  }

  // Fetch user profiles for participants
  const fetchUserProfiles = async (userIds: string[]) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .in('id', userIds)

    if (!error && data) {
      const profilesMap = data.reduce((acc, profile) => {
        acc[profile.id] = profile
        return acc
      }, {} as Record<string, UserProfile>)
      setParticipants(prev => ({ ...prev, ...profilesMap }))
    }
  }

  // Fetch messages with user info
  const fetchMessages = async (roomId: string) => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        reply_to:reply_to_id (
          id,
          content,
          sender_id
        )
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })

    if (!error) {
      setMessages(data as ChatMessage[])
      // Fetch profiles for all unique senders
      const userIds = Array.from(
        new Set(data.map(msg => msg.sender_id).concat(data.filter(msg => msg.reply_to).map(msg => msg.reply_to.sender_id))
      )
      await fetchUserProfiles(userIds)
    }
    setIsLoading(false)
  }

  // Initial load
  useEffect(() => {
    fetchRooms()
  }, [])

  // When room changes
  useEffect(() => {
    if (!currentRoom) return
    
    fetchMessages(currentRoom.id)
    
    const channel = supabase
      .channel(`room_${currentRoom.id}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages', 
          filter: `room_id=eq.${currentRoom.id}` 
        },
        async (payload) => {
          const newMessage = payload.new as ChatMessage
          setMessages(prev => [...prev, newMessage])
          // Fetch sender profile if not already loaded
          if (!participants[newMessage.sender_id]) {
            await fetchUserProfiles([newMessage.sender_id])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentRoom])

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentRoom || !user) return
    
    const { error } = await supabase.from('chat_messages').insert({
      room_id: currentRoom.id,
      sender_id: user.id,
      content: newMessage.trim()
    })
    
    if (!error) {
      setNewMessage('')
    }
  }
  
  const handleCreateRoom = async (name: string, isPrivate: boolean) => {
    if (!user) return
    
    const { data, error } = await supabase
      .from('chat_rooms')
      .insert({ 
        name, 
        is_private: isPrivate,
        created_by: user.id 
      })
      .select()
      .single()
    
    if (!error && data) {
      // Add creator as participant if private
      if (isPrivate) {
        await supabase.from('chat_participants').insert({
          room_id: data.id,
          user_id: user.id,
          role: 'admin'
        })
      }
      
      await fetchRooms()
      setCurrentRoom(data as ChatRoom)
    }
  }

  const getAvatar = (userId: string) => {
    const profile = participants[userId]
    return profile?.avatar_url 
      ? <img src={profile.avatar_url} className="h-8 w-8 rounded-full" />
      : <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
          {profile?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
  }

  return (
    <DashboardLayout title="Chat" navigation={adminNavigation}>
      <CreateRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateRoom}
      />
      
      <div className="flex flex-col md:flex-row h-[calc(100vh_-_8rem)]">
        {/* Chat rooms sidebar */}
        <aside className="md:w-1/4 border-r bg-white overflow-y-auto flex flex-col">
          <div className="p-4 border-b">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Nouveau Salon
            </button>
          </div>
          
          {isLoading && rooms.length === 0 ? (
            <div className="p-4 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {rooms.length === 0 ? (
                <p className="p-4 text-gray-500">Aucun salon de discussion disponible.</p>
              ) : (
                rooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setCurrentRoom(room)}
                    className={`px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors flex justify-between items-center ${
                      currentRoom?.id === room.id ? 'bg-indigo-50 font-semibold text-indigo-800' : ''
                    }`}
                  >
                    <div>
                      <span className="font-medium"># {room.name}</span>
                      {room.is_private && (
                        <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">Privé</span>
                      )}
                    </div>
                    {room.last_message_at && (
                      <span className="text-xs text-gray-500">
                        {new Date(room.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </aside>

        {/* Main chat area */}
        <main className="flex-1 flex flex-col bg-gray-50">
          {currentRoom && (
            <div className="p-4 border-b bg-white">
              <h2 className="font-semibold"># {currentRoom.name}</h2>
              {currentRoom.is_private && (
                <p className="text-sm text-gray-500">Salon privé - Seuls les membres peuvent voir les messages</p>
              )}
            </div>
          )}
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              <div className="flex justify-center pt-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : currentRoom ? (
              messages.length === 0 ? (
                <div className="text-center text-gray-500 pt-10">
                  <p>Aucun message dans ce salon.</p>
                  <p className="text-sm">Soyez le premier à envoyer un message !</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-lg ${msg.sender_id !== user?.id ? 'flex items-start' : ''}`}>
                      {msg.sender_id !== user?.id && (
                        <div className="mr-2 mt-1">
                          {getAvatar(msg.sender_id)}
                        </div>
                      )}
                      
                      <div className={`p-3 rounded-lg ${msg.sender_id === user?.id ? 'bg-indigo-500 text-white' : 'bg-white shadow-sm'}`}>
                        {msg.reply_to && (
                          <div className={`text-xs mb-1 px-2 py-1 rounded ${msg.sender_id === user?.id ? 'bg-indigo-400' : 'bg-gray-100'}`}>
                            <p className="truncate">Réponse à: {msg.reply_to.content}</p>
                          </div>
                        )}
                        
                        <p className="text-sm">{msg.content}</p>
                        <div className={`flex items-center mt-1 space-x-2 ${msg.sender_id === user?.id ? 'text-indigo-200' : 'text-gray-400'}`}>
                          <span className="text-xs">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {msg.is_edited && (
                            <span className="text-xs">(modifié)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )
            ) : (
              <div className="text-center text-gray-500 pt-10">
                <h3 className="text-lg font-semibold">Bienvenue sur le Chat</h3>
                <p>Sélectionnez un salon pour commencer ou créez-en un nouveau.</p>
              </div>
            )}
          </div>

          {/* Message input */}
          {currentRoom && (
            <div className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') sendMessage() }}
                  placeholder="Écrivez un message..."
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  Envoyer
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  )
}