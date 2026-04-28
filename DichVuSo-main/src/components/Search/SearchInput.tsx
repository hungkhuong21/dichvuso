import searchIcon from '~/assets/svg/search_icon.svg'

interface SearchProps {
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

export default function SearchInput({ setSearch }: SearchProps) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  return (
    <div className='flex flex-row justify-items-center border rounded-full w-1/2 max-md:w-10/12 px-5 hover:border-red-500'>
      <img src={searchIcon} />
      <input
        type='text'
        placeholder='Tìm kiếm dịch vụ'
        className='w-full leading-6 text-base font-normal px-[0.375rem] py-[0.5rem] focus:outline-none focus:border-none'
        onChange={handleInputChange}
      />
    </div>
  )
}
