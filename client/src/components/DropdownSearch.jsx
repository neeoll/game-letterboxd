import { useState } from "react"
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react"
import SimpleBar from "simplebar-react"
import PropTypes from 'prop-types'
import { RxCross2 } from "react-icons/rx"

const DropdownSearch = (props) => {
  const [query, setQuery] = useState("")

  const filteredArray = query === '' ?
    props.array : 
    props.array.filter((item) => {
      return item.name.toLowerCase().includes(query.toLowerCase())
    })

  return (
    <Combobox immediate value={props.array.find(item => item.id == props.value) || null} onChange={(value) => { if (value != null) props.setValue(value.id) }} onClose={() => setQuery('')}>
      <div className="relative flex h-8 rounded w-full text-sm border border-white/50 focus:border-white text-white">
        <ComboboxInput
          className="w-52 p-1 text-sm bg-transparent outline-none"
          displayValue={(item) => item?.name}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={props.placeholder}
          autoComplete="new-password"
        />
        {props.value != -1 ? (
          <button className="absolute  right-0 flex items-center size-8" onClick={() => props.setValue(-1)}>
            <RxCross2 className="text-lg" />
          </button>
        ): (<></>)}
      </div>
      <ComboboxOptions anchor="bottom start" className="w-52 rounded bg-neutral-900 border border-white/50 mt-2">
        <SimpleBar autoHide={false} style={{ maxHeight: 200 }}>
          {
            filteredArray.map((item, index) => (
              <ComboboxOption key={index} value={item} className="p-1 text-white hover:bg-neutral-800 hover:cursor-pointer">
                <p>{item.name}</p>
              </ComboboxOption>
            ))
          }
        </SimpleBar>
      </ComboboxOptions>
    </Combobox>
  )
}

DropdownSearch.propTypes = {
  array: PropTypes.array,
  value: PropTypes.number,
  setValue: PropTypes.func,
  placeholder: PropTypes.string,
}

export default DropdownSearch