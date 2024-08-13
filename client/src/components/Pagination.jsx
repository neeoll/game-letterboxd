import { RxCaretLeft, RxCaretRight } from "react-icons/rx"
import PropTypes from 'prop-types'

const Pagination = ({ page, count, update }) => {
  const maxPage = Math.ceil(count / 36)

  const incrementPage = () => {
    const newPage = Math.min(page + 1, maxPage)
    update([{ params: 'page', value: newPage }])
  }

  const decrementPage = () => {
    const newPage = Math.max(1, page - 1)
    update([{ params: 'page', value: newPage }])
  }

  return (
    <div className="px-52">
      <div className="flex justify-center items-center overflow-x-hidden gap-4 text-indigo-50 py-2">

        <div className={`${page == 1 ? "pointer-events-none text-indigo-50/50" : ""} relative w-8 h-8 group group-invalid/form:pointer-events-none group-invalid/form:brightness-50`}>
          <div className="absolute w-full h-full blur-sm group-hover:bg-gradient-to-l hover:gradient-to-r from-[#ff9900] to-[#ff00ff] p-1"><RxCaretLeft /></div>
          <button onClick={() => decrementPage()} className="flex justify-center items-center relative w-full h-full rounded-md bg-neutral-900">
            <RxCaretLeft />
          </button>
        </div>
        <div className="flex gap-2">
          <p>Page</p>
          <input 
            type="tel"
            min="1"
            placeholder={page}
            max={maxPage}
            onKeyDown={e => { if (e.key === 'Enter') update([{ params: 'page', value: e.target.value }]) }}
            className="w-10 text-center align-middle bg-transparent rounded border border-white/50"
          />
          <p>of {maxPage}</p>
        </div>
        <div className={`${page == maxPage ? "pointer-events-none text-indigo-50/50" : ""} relative w-8 h-8 group group-invalid/form:pointer-events-none group-invalid/form:brightness-50`}>
          <div className="absolute w-full h-full blur-sm group-hover:bg-gradient-to-r hover:gradient-to-r from-[#ff9900] to-[#ff00ff] p-1"><RxCaretLeft /></div>
          <button onClick={() => incrementPage()} className="flex justify-center items-center relative w-full h-full rounded-md bg-neutral-900">
            <RxCaretRight />
          </button>
        </div>
      </div>
    </div>
  )
}

Pagination.propTypes = {
  page: PropTypes.number,
  count: PropTypes.number,
  update: PropTypes.func
}

export default Pagination