export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-2 text-[#1a202c]">Bem-vindo de volta</h1>
        <p className="text-gray-500 mb-8">Faça login para acessar seu dashboard</p>
        <form className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-[#1a202c]">Email</label>
            <input
              id="email"
              type="email"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black text-[#1a202c] bg-white"
              placeholder="Digite seu email"
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-[#1a202c]">Senha</label>
            <input
              id="password"
              type="password"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black text-[#1a202c] bg-white"
              placeholder="Digite sua senha"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-900 transition-colors text-lg"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
