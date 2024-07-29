import { useState } from "react"
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react"
import SimpleBar from "simplebar-react"

const DropdownSearch = (props) => {
  const [query, setQuery] = useState("")

  const filteredArray = query === '' ?
    props.array : 
    props.array.filter((item) => {
      return item.name.toLowerCase().includes(query.toLowerCase())
    })

  return (
    <Combobox immediate value={props.array.find(item => item.id == props.value)} onChange={(value) => { if (value != null) props.setValue(value.id) }} onClose={() => setQuery('')}>
      <ComboboxInput
        className="h-8 rounded w-full p-1 border-indigo-300 text-sm bg-neutral-700 text-white"
        displayValue={(item) => item?.name}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={props.placeholder}
        autoComplete="new-password"
      />
      <ComboboxOptions anchor="bottom" className="w-52 rounded bg-neutral-700 mt-2">
        <SimpleBar autoHide={false} style={{ maxHeight: 200 }}>
          {
            filteredArray.map((genre) => (
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

export default DropdownSearch