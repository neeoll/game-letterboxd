export const completionStatuses = [
  {
    id: 1,
    element: () => (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <div>Completed</div>
      </div>
    ),
    value: "completed"
  },
  {
    id: 2,
    element: () => (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-sky-500" />
        <div>Played</div>
      </div>
    ),
    value: "played"
  },
  {
    id: 3,
    element: () => (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-yellow-500" />
        <div>Shelved</div>
      </div>
    ),
    value: "shelved"
  },
  {
    id: 4,
    element: () => (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <div>Abandoned</div>
      </div>
    ),
    value: "abandoned"
  },
]