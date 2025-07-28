import { FunctionalComponent } from 'preact'
import { useState } from 'preact/hooks'

interface CalculatorProps {
  onClose: () => void
  onSelect: (amount: number) => void
}

export const Calculator: FunctionalComponent<CalculatorProps> = ({
  onClose,
  onSelect,
}) => {
  const [input, setInput] = useState('')

  const handleButtonClick = (value: string) => {
    setInput(input + value)
  }

  const handleClear = () => {
    setInput('')
  }

  const handleCalculate = () => {
    try {
      const result = eval(input)
      onSelect(result)
      onClose()
    } catch (error) {
      console.error('Invalid expression', error)
      setInput('Error')
    }
  }

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2d2d2d] rounded-lg p-5 shadow-lg z-50 w-80">
      <div className="bg-[#1e1e1e] text-white text-2xl p-2 text-right rounded h-14 leading-[3.5rem] overflow-hidden text-ellipsis whitespace-nowrap">
        {input || '0'}
      </div>
      <div className="grid grid-cols-4 gap-2 mt-4">
        <button onClick={() => handleButtonClick('7')} className="p-4 text-xl bg-[#505050] text-white rounded hover:bg-[#707070]">7</button>
        <button onClick={() => handleButtonClick('8')} className="p-4 text-xl bg-[#505050] text-white rounded hover:bg-[#707070]">8</button>
        <button onClick={() => handleButtonClick('9')} className="p-4 text-xl bg-[#505050] text-white rounded hover:bg-[#707070]">9</button>
        <button onClick={() => handleButtonClick('/')} className="p-4 text-xl bg-[#ff9500] text-white rounded hover:bg-[#ffb040]">
          /
        </button>
        <button onClick={() => handleButtonClick('4')} className="p-4 text-xl bg-[#505050] text-white rounded hover:bg-[#707070]">4</button>
        <button onClick={() => handleButtonClick('5')} className="p-4 text-xl bg-[#505050] text-white rounded hover:bg-[#707070]">5</button>
        <button onClick={() => handleButtonClick('6')} className="p-4 text-xl bg-[#505050] text-white rounded hover:bg-[#707070]">6</button>
        <button onClick={() => handleButtonClick('*')} className="p-4 text-xl bg-[#ff9500] text-white rounded hover:bg-[#ffb040]">
          *
        </button>
        <button onClick={() => handleButtonClick('1')} className="p-4 text-xl bg-[#505050] text-white rounded hover:bg-[#707070]">1</button>
        <button onClick={() => handleButtonClick('2')} className="p-4 text-xl bg-[#505050] text-white rounded hover:bg-[#707070]">2</button>
        <button onClick={() => handleButtonClick('3')} className="p-4 text-xl bg-[#505050] text-white rounded hover:bg-[#707070]">3</button>
        <button onClick={() => handleButtonClick('-')} className="p-4 text-xl bg-[#ff9500] text-white rounded hover:bg-[#ffb040]">
          -
        </button>
        <button onClick={() => handleButtonClick('0')} className="col-span-1 p-4 text-xl bg-[#505050] text-white rounded hover:bg-[#707070]">
          0
        </button>
        <button onClick={() => handleButtonClick('.')} className="p-4 text-xl bg-[#505050] text-white rounded hover:bg-[#707070]">
          .
        </button>
        <button onClick={handleCalculate} className="p-4 text-xl bg-[#ff9500] text-white rounded hover:bg-[#ffb040]">
          =
        </button>
        <button onClick={() => handleButtonClick('+')} className="p-4 text-xl bg-[#ff9500] text-white rounded hover:bg-[#ffb040]">
          +
        </button>
        <button onClick={handleClear} className="col-span-2 p-4 text-xl bg-[#d4d4d2] text-black rounded hover:bg-[#e8e8e6]">
          C
        </button>
        <button onClick={onClose} className="col-span-2 p-4 text-xl bg-[#d4d4d2] text-black rounded hover:bg-[#e8e8e6]">
          Close
        </button>
      </div>
    </div>
  )
}
