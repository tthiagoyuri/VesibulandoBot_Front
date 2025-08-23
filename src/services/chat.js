export function sendMessageToBot(text) {
  return new Promise((resolve) => {
    const replies = [
      `Ótima pergunta! Vamos explorar: "${text}".`,
      `Entendi. Sobre "${text}", aqui vai um resumo...`,
      `Aqui está uma dica rápida sobre "${text}".`,
      `Legal! Para "${text}", considere começar por...`,
    ]
    const pick = replies[Math.floor(Math.random() * replies.length)]
    setTimeout(() => {
      resolve(pick)
    }, 600)
  })
}
