import { RxCaretLeft, RxCaretRight } from "react-icons/rx"

const Pagination = ({ page, count, setPage }) => {
  return (
    <div className="px-52">
      <div className="flex justify-center items-center overflow-x-hidden gap-4 text-white">
        <button 
        onClick={() => setPage(Math.max(1, page - 1))} 
        className={`${page == 1 ? "pointer-events-none text-white/50" : ""} flex min-h-8 min-w-8 justify-center items-center rounded-lg hover:border`}>
          <RxCaretLeft />
        </button>
        <div className="flex gap-2">
          <p>Page</p>
          <input 
            type="tel"
            min="1"
            placeholder={page}
            max={Math.ceil(count / 36)}
            onKeyDown={e => { if (e.key === 'Enter') setPage(e.target.value) }}
            className="w-10 text-center align-middle bg-transparent rounded border border-white/50"
          />
          <p>of {Math.ceil(count / 36)}</p>
        </div>
        <button 
        onClick={() => setPage(Math.min(page + 1, Math.ceil(count / 36)))} 
        className={`${page == Math.ceil(count / 36) ? "pointer-events-none text-white/50" : ""} flex min-h-8 min-w-8 justify-center items-center rounded-lg hover:border`}>
          <RxCaretRight />
        </button>
      </div>
    </div>
  )
}

export default Pagination