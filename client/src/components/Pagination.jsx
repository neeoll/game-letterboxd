import { RxCaretLeft, RxCaretRight } from "react-icons/rx"
import PropTypes from 'prop-types'

const Pagination = ({ page, count, update }) => {
  const maxPage = Math.ceil(count / 40)

  const incrementPage = () => {
    const newPage = Math.min(page + 1, maxPage)
    update([{ params: 'page', value: newPage }])
  }

  const decrementPage = () => {
    const newPage = Math.max(1, page - 1)
    update([{ params: 'page', value: newPage }])
  }

  return (
    <div className="flex justify-center items-center gap-4 text-white">
      <div className={`${page == 1 ? "pointer-events-none text-white/50" : ""} relative size-8 group group-invalid/form:pointer-events-none group-invalid/form:brightness-50`}>
        <div className="absolute w-full h-full blur-sm group-hover:bg-gradient-to-l from-accentPrimary to-accentSecondary" />
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
          className="w-10 text-center bg-transparent"
        />
        <p>of {maxPage}</p>
      </div>
      <div className={`${page == maxPage ? "pointer-events-none text-white/50" : ""} relative size-8 group group-invalid/form:pointer-events-none group-invalid/form:brightness-50`}>
        <div className="absolute w-full h-full blur-sm group-hover:bg-gradient-to-r from-accentPrimary to-accentSecondary" />
        <button onClick={() => incrementPage()} className="flex justify-center items-center relative w-full h-full rounded-md bg-neutral-900">
          <RxCaretRight />
        </button>
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