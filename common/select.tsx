import { forwardRef } from 'react'

export interface SelectOption {
  value: string | number
  name?: string
}

interface Properties {
  label: string
  name?: string
  id: string
  options: SelectOption[]
}

const Select = forwardRef<HTMLSelectElement, Properties>(
  ({ id, name, options, label }, reference) => {
    return (
      <label className="grid gap-1" htmlFor={id}>
        {label}:
        <select
          className="p-2 bg-white border-b-2 border-gray-200 duration-300
        hover:border-indigo-300
        active:border-indigo-500
        focus:border-indigo-500 outline-none
        "
          name={name}
          id={id}
          ref={reference}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.name ?? option.value}
            </option>
          ))}
        </select>
      </label>
    )
  },
)

Select.displayName = 'Select'

export default Select
