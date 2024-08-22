import { RxCaretDown, RxTriangleDown, RxTriangleUp } from "react-icons/rx"
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react"
import PropTypes from 'prop-types'

const Sort = (props) => {
  return (
    <div className="flex w-fit items-center">
      <p className="text-indigo-50/50 text-sm font-light text-nowrap">Sort By</p>
      <button onClick={() => props.update([{ params: 'sortOrder', value: (props.sortOrder == -1 ? 1 : -1) }])} className="flex flex-col">
        <RxTriangleUp className={`${props.sortOrder == 1 ? "text-indigo-50" : "text-indigo-50/50"} text-2xl -mb-2`}/>
        <RxTriangleDown className={`${props.sortOrder == -1 ? "text-indigo-50" : "text-indigo-50/50"} text-2xl -mt-2`}/>
      </button>
      <Listbox value={props.criteria.find(sort => sort.value == props.sortBy)} onChange={(value) => { if (value != null) props.update([{ params: 'sortBy', value: value.value }]) }}>
        <ListboxButton className="flex text-indigo-50 items-center gap-1 w-full text-sm">{props.criteria.find(sort => sort.value == props.sortBy).name}<RxCaretDown /></ListboxButton>
        <ListboxOptions anchor="bottom start" className="rounded bg-gray-800 text-xs">
          {
            props.criteria.map(criteria => (
              <ListboxOption key={criteria.id} value={criteria} className="w-full py-1.5 px-2 hover:bg-gradient-to-r from-[#ff9900] to-[#ff00ff]">
                <p className="text-indigo-50">{criteria.name}</p>
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