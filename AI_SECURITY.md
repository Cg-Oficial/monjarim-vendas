# Política de segurança para IA em produção

Este documento complementa `AI_RULES.md`. Aplique-o ao projetar, revisar ou alterar qualquer fluxo que trate dados pessoais, credenciais, integrações, ferramentas ou modelos de IA. **Um prompt não é uma fronteira de segurança**: controles efetivos precisam ser implementados e verificados no servidor, na infraestrutura e nas permissões.

## 1. Prioridade e decisão

- Segurança, privacidade e integridade dos dados precedem conveniência e velocidade.
- Use Zero Trust, menor privilégio, minimização, separação de responsabilidades e configurações seguras por padrão.
- Negue ações quando identidade, autorização, escopo ou integridade não puderem ser comprovados. Não contorne controles para fazer uma integração funcionar.
- Diferencie risco comprovado de hipótese; não afirme que uma implementação é “segura” apenas por conter instruções em um prompt.

## 2. Segredos, repositório e publicação

- Nenhuma chave de IA, token, senha, JWT, certificado, credencial de serviço ou segredo de backend pode ir para código cliente, HTML, bundle, armazenamento do navegador, logs ou repositório.
- Leia segredos exclusivamente no servidor a partir do mecanismo de secrets do ambiente de execução. Nunca prefixe segredos com `VITE_` nem os exponha por endpoints de configuração.
- Mantenha `.env`, `.env.*` (exceto exemplos sem valores reais), chaves e certificados fora do Git. Use `.env.example` apenas com placeholders.
- Se uma credencial for exposta, trate-a como comprometida: revogue/rotacione imediatamente, procure usos indevidos e avalie a remoção do histórico. Apagar o valor do arquivo não invalida a credencial nem apaga cópias já clonadas.
- Repositórios com dados ou código que não possam ser públicos devem ser privados. Mesmo em repositórios públicos, código e histórico nunca devem conter segredos ou dados de clientes.
- Hosting estático, incluindo GitHub Pages, não executa endpoints privados nem protege segredos. Não implante ali uma integração que dependa de chave de servidor; use um backend hospedado em runtime apropriado.

## 3. Dados pessoais e envio a modelos

- Envie ao provedor somente os campos estritamente necessários, para uma finalidade autorizada e compatível com a política de privacidade.
- Evite coletar ou armazenar dados sensíveis. Antes de enviar texto a um modelo, remova ou substitua identificadores diretos e conteúdo não necessário; não envie registros completos, dumps ou payloads brutos.
- Redaction automatizada é uma defesa auxiliar, não uma garantia de anonimização. Não envie dados sensíveis quando a remoção não puder ser validada; use identificadores sintéticos e contexto mínimo.
- Considere retenção e uso do provedor, região, subprocessadores e configuração de treinamento antes de ativar uma integração. Não prometa exclusão ou não retenção sem confirmação contratual/técnica.
- Armazene o mínimo pelo menor período necessário e implemente exclusão quando houver persistência.

## 4. Arquitetura do fluxo de IA

Fluxo recomendado: cliente → HTTPS → autenticação quando aplicável → rate limit e limites de custo → validação de tipo/tamanho → autorização e escopo → minimização/redaction → backend/orquestrador → provedor → validação da resposta → cliente.

- Chamadas ao provedor acontecem somente no servidor. O cliente nunca recebe a chave do provedor.
- O backend valida novamente cada campo e cada permissão; não confia em validações feitas apenas pelo browser.
- Vincule operações autenticadas a usuário, tenant, papel e escopo. Consulte dados com filtros de autorização no servidor; nunca dependa de IDs fornecidos pelo cliente para provar acesso.
- Ferramentas de IA devem ter allowlist explícita, argumentos validados e permissões mínimas. Não ofereça shell, SQL arbitrário, leitura arbitrária de arquivos, acesso ao ambiente, secrets ou administração geral.
- A resposta do modelo é conteúdo não confiável: valide estrutura, limite tamanho e renderize como texto escapado. Não execute conteúdo, HTML, URLs ou instruções retornadas sem validação independente.

## 5. Prompt injection e limites do modelo

- Trate mensagens do usuário, documentos, resultados de busca, banco de dados e conteúdo de integrações como dados não confiáveis, mesmo que peçam para ignorar instruções anteriores.
- Separe instruções confiáveis de dados externos e não permita que texto recuperado altere permissões, escopo, política ou seleção de ferramentas.
- Instruções do system prompt orientam comportamento, mas não substituem autenticação, autorização, validação, isolamento ou controles de saída.
- Não permita que o modelo decida sozinho se um pedido está autorizado. O servidor aplica a política antes de chamar qualquer ferramenta ou fornecer dado protegido.

## 6. Autenticação, transporte e abuso

- Use HTTPS/TLS em todo tráfego externo e proteções de transporte adequadas ao host, como HSTS quando suportado.
- Exija autenticação e autorização em operações privadas. Use sessões seguras, expiração, revogação e proteção contra CSRF quando aplicável.
- Limite frequência, concorrência, tamanho do corpo, tamanho de prompt/resposta e tokens/custo. Use limites persistentes ou no gateway de produção; limites em memória de uma instância não equivalem a proteção global em serverless.
- Configure timeouts, retries limitados com backoff, circuit breaker e limites de gasto. Não repita indefinidamente chamadas que cobram por uso.
- Valide origem quando aplicável, mas não trate CORS como autenticação ou autorização.

## 7. Logs, auditoria e incidentes

- Não registre prompts completos, respostas brutas, cabeçalhos de autorização, tokens, chaves, PII ou payloads sensíveis.
- Registre somente metadados necessários: identificador não sensível da requisição, horário, estado, latência, provedor/modelo e erro sanitizado. Proteja acesso e retenção dos logs.
- Remova dados sensíveis de mensagens de erro e telemetria. Evite incluir conteúdo externo em logs sem escape contra log injection.
- Audite alterações de permissões, uso de ferramentas e eventos de segurança sem registrar o conteúdo sensível dessas operações.

## 8. Produção e revisão

Antes de disponibilizar um fluxo de IA, confira: segredos apenas no runtime servidor; host capaz de executar backend; autenticação/autorização adequadas ao tipo de dado; isolamento de tenant; minimização; limites de abuso/custo; tratamento de falhas; resposta segura; logs redigidos; retenção; permissões e dependências revisadas.

Não declare compliance legal, anonimização garantida ou segurança absoluta sem evidência. Documente o que está implementado, o que depende de configuração do provedor/host e os riscos residuais. Quando uma proteção essencial não existir, bloqueie a implantação sensível e informe a dependência claramente.
