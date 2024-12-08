import { useEffect, useState } from 'react'

interface Wallet {
  address: string;
  id: string;
}
function App() {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [flag, setFlag] = useState(false)
  useEffect(() => {
    async function loadWallet() {
      const response = await fetch("http://localhost:8000/api/wallet/status",{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })   
      const wallet = await response.json()   
      setWallet({
        address: wallet.wallet.address,
        id: wallet.wallet.id
      })
    }
    loadWallet()
  }, [])

  async function handleGenerate() {
    try {
      const response = await fetch('http://localhost:8000/api/wallet/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const wallet = await response.json()
      console.log("generate wallet", { address: wallet.wallet.address, id: wallet.wallet.id })
      setWallet({
        address: wallet.wallet.address,
        id: wallet.wallet.id
      })
    } catch (error) {
      console.error(error)
    }
  }

  function truncate(str: string, n: number) {
    return str.length > n ? str.substring(0, n - 1) + "..." + str.substring(str.length - n + 3, str.length) : str
  }

  function handleCopy() {
    navigator.clipboard.writeText(wallet!.address)
    setFlag(true)
    
  }

  return (
    <div className="flex flex-col items-center w-[360px] h-[600px] justify-between">
      {!wallet ? (
        <>
          <nav className="w-full flex items-center justify-end h-[60px] py-2.5 px-3 shadow-xl drop-shadow-xl shadow-[#00000066]">
            <img className="w-10 h-10 cursor-pointer" src="/passwords.svg" alt="passwords" />
          </nav>
          <div className='w-full h-full flex flex-1 flex-col items-center justify-center p-8 text-wrap text-center'>
            <div className='w-full flex items-center justify-center mb-10 mt-5'>
              <img className="w-20 h-20 cursor-pointer" src="/passwords.svg" alt="passwords" />
            </div>
            <div className='w-full flex flex-col h-full items-center gap-4 mt-2'>
              <h2 className='text-xl leading-6 font-parkinsans font-semibold text-[#bbc0c5]'>Welcome to Passwords!</h2>
              <p className='text-base text-[#808080] font-parkinsans font-medium'>Your password awaits . . .</p>
            </div>
            <button className="bg-[#0A67C2] text-white p-3 rounded-md w-full hover:bg-[#0A67C2]/80 font-unbounded mb-5" onClick={handleGenerate}>Generate wallet</button>
          </div>
        </>
      ) : (
        <>
          <nav className="w-full flex items-center justify-center h-[60px] py-2.5 px-3 shadow-xl drop-shadow-xl shadow-[#00000066]">
            <div className='w-full flex flex-col items-center justify-between gap-1'>
              <p className='text-sm font-parkinsans font-semibold'>Account</p>
              <div className='group flex items-center justify-center gap-2 hover:bg-[#252525] active:scale-95 cursor-pointer p-1 rounded-md' onClick={handleCopy}>
                <p className='text-xs text-[#808080] font-unbounded font-medium'>{truncate(wallet.address, 8)}</p>
                <img className="w-4 h-4 cursor-pointer group-hover:invert" style={flag ? { maskImage: "url('/copy-success.svg')"}: { maskImage: 'none'} } src="/copy.svg" alt="copy" />
              </div>
            </div>
          </nav>
          <div className='w-full h-full text-base flex flex-1 flex-col items-center justify-between'>
            
          </div>
        </>
      )}
    </div>
  )
}

export default App
