# the poem situation — como colocar no ar

Quatro arquivos. Sobe na Vercel de graça, funciona como app no celular, e salva as conversas no seu próprio aparelho.

```
poem-app/
├── index.html        o app
├── manifest.json     pra instalar na tela inicial
├── package.json
└── api/
    └── chat.js       o backend, onde a chave fica escondida
```

## 1. Pegar a chave da API

Entre em console.anthropic.com, crie uma conta se ainda não tiver, e vá em **API Keys → Create Key**. Copie a chave (começa com `sk-ant-`). Ela só aparece uma vez.

Coloque uns poucos dólares de crédito em Billing. Conversa de texto gasta muito pouco — cada resposta dos quatro custa fração de centavo.

**Nunca coloque essa chave no index.html.** É pra isso que existe o `api/chat.js`.

## 2. Subir

O jeito mais rápido, direto do celular ou do computador:

1. Crie um repositório novo no GitHub e mande esses arquivos pra lá, mantendo a pasta `api/`.
2. Entre em vercel.com, faça login com o GitHub e clique em **Add New → Project**.
3. Escolha o repositório. Não precisa mudar nenhuma configuração — a Vercel reconhece sozinha.
4. Antes de clicar em Deploy, abra **Environment Variables** e adicione:
   - Nome: `ANTHROPIC_API_KEY`
   - Valor: sua chave
5. Deploy.

Em um ou dois minutos você recebe um endereço tipo `poem-situation.vercel.app`.

Se preferir pelo terminal: instale a CLI com `npm i -g vercel`, rode `vercel` dentro da pasta, e depois `vercel env add ANTHROPIC_API_KEY`.

## 3. Instalar no celular

Abra o endereço no navegador do celular.

- **iPhone (Safari):** botão de compartilhar → Adicionar à Tela de Início
- **Android (Chrome):** menu → Adicionar à tela inicial

Vai abrir em tela cheia, sem barra de navegador, como app.

## 4. Deixar privado

O endereço é público — qualquer um que souber consegue abrir e gastar seus créditos. Duas opções:

**Simples:** em Settings → Deployment Protection, ative **Password Protection** e escolha uma senha. Você digita uma vez e pronto.

**Sem custo nenhum:** no `api/chat.js`, logo depois da checagem da chave, adicione:

```js
if (req.headers['x-senha'] !== process.env.SENHA) {
  return res.status(401).json({ error: 'não autorizado' });
}
```

E no `index.html`, dentro do `fetch("/api/chat", ...)`, mude os headers para:

```js
headers: { "Content-Type": "application/json", "x-senha": "aquilo-que-voce-escolher" }
```

Não é segurança de verdade, mas afasta quem passar por acaso.

## Onde mexer no app

Tudo está no `index.html`:

- **`SYSTEM`** — quem são os quatro, como falam, o que sabem sobre você e sobre os poemas. É aqui que se corrige uma voz que saiu do personagem.
- **`PACE`** — quanto tempo cada um demora pra responder, em milissegundos. `first` é a espera antes da primeira mensagem dele, `next` o intervalo entre mensagens seguidas.
- **`SEED`** — a conversa que já vem carregada. Pode apagar, editar ou continuar de outro ponto.
- **`P_LUKE`, `P_MIKE`, `P_CAL`, `P_ASH`, `P_REAL`** — os poemas.

Pra trocar um poema ou adicionar outro, é só editar essas variáveis.

## Se der problema

- **"ANTHROPIC_API_KEY não configurada"** — a variável não foi salva na Vercel, ou foi salva depois do deploy. Adicione e faça um redeploy.
- **Erro 401** — chave errada ou revogada.
- **Erro 429** — sem créditos ou muitas requisições seguidas.
- **Nada salva** — modo privado do navegador bloqueia o armazenamento. Use uma aba normal.
