import { RxCaretDown, RxTriangleDown, RxTriangleUp } from "react-icons/rx"
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react"
import PropTypes from 'prop-types'

const Sort = (props) => {
  return (
    <div className="flex items-center text-white">
      <p className="text-white/50 text-sm font-light text-nowrap">Sort By</p>
      <button onClick={() => props.update([{ params: 'sortOrder', value: (props.sortOrder == -1 ? 1 : -1) }])} className="flex flex-col">
        <RxTriangleUp className={`${props.sortOrder == 1 ? "" : "text-white/50"} text-2xl -mb-2`}/>
        <RxTriangleDown className={`${props.sortOrder == -1 ? "" : "text-white/50"} text-2xl -mt-2`}/>
      </button>
      <Listbox value={props.criteria.find(sort => sort.value == props.sortBy)} onChange={(value) => { if (value != null) props.update([{ params: 'sortBy', value: value.value }]) }}>
        <ListboxButton className="flex text-white items-center gap-1 text-sm">{props.criteria.find(sort => sort.value == props.sortBy).name}<RxCaretDown /></ListboxButton>
        <ListboxOptions anchor="bottom start" className="rounded bg-neutral-700 text-xs mt-1">
          {
            props.criteria.map(criteria => (
              <ListboxOption key={criteria.id} value={criteria} className="py-1.5 px-2 hover:bg-gradient-to-r from-accentPrimary to-accentSecondary">
                <p className="text-white">{criteria.name}</p>
              </ListboxOption>
            ))
          }
        </ListboxOptions>
      </Listbox>
    </div>
  )
}

Sort.propTypes = {
  update: PropTypes.func,
  sortOrder: PropTypes.number,
  criteria: PropTypes.array,
  sortBy: PropTypes.string,
}

export default Sort