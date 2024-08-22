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
      <div className="flex h-8 rounded w-full text-sm bg-neutral-700">
        <ComboboxInput
          className="w-full p-1 text-sm bg-transparent outline-none text-white"
          displayValue={(item) => item?.name}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={props.placeholder}
          autoComplete="new-password"
        />
        {props.value != -1 ? (
          <button className="flex justify-center items-center size-8" onClick={() => props.setValue(-1)}>
            <RxCross2 color="white" size={"1.25em"}/>
          </button>
        ): (<></>)}
      </div>
      <ComboboxOptions anchor="bottom" className="w-52 rounded bg-neutral-700 mt-2">
        <SimpleBar autoHide={false} style={{ maxHeight: 200 }}>
          {
            filteredArray.map(genre => (
              <ComboboxOption key={genre.id} value={genre} className="w-full p-1 hover:bg-neutral-600">
                <p className="text-white">{genre.name}</p>
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