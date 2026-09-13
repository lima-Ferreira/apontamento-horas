# Apontamento de Horas V1.6 — copiar pacote para o Banco

## Novidade principal
- Caixa **Código para o Banco de Horas — TOQUE PARA COPIAR**.
- Um toque copia **somente** o conteúdo técnico que começa em `BHAP1:` e termina no último caractere do pacote.
- Não copia título, resumo, instruções ou outras partes da mensagem.
- O botão **Copiar para o Banco de Horas** faz exatamente a mesma ação.
- Copiar não marca o apontamento como enviado.
- Mantidos Pendentes/Enviados, Reenviar, WhatsApp, JSON e backup.
- Mesmas chaves `apontamento_v1_*`, preservando os dados já existentes no aparelho.
- Cache do PWA atualizado para V1.6.

# Apontamento de Horas V1.5 — Copiar dados

## Novidade
- Cada apontamento ganhou o botão **Copiar dados**.
- Copia somente os dados úteis do lançamento: funcionário, data, hora extra, motivo, horários/intervalo quando existirem, companhia e observação.
- Não copia código interno, BHAP1 ou informações técnicas.
- Após copiar, o botão mostra **Copiado ✓**.
- Se a API de clipboard não estiver disponível, abre uma caixa com o texto para cópia manual.
- Mantém o controle Pendentes/Enviados da V1.4 e as mesmas chaves do localStorage, preservando os dados existentes.
- Cache do Service Worker atualizado para V1.5.


## O que mudou
- Envio pelo WhatsApp leva somente apontamentos que ainda não foram enviados.
- Ao abrir o WhatsApp, os registros enviados ficam marcados como **Enviados** no aparelho.
- Registros antigos continuam salvos para consulta e não entram automaticamente em novos pacotes.
- Botão **Reenviar** devolve um registro já enviado para a fila de pendentes.
- Se um registro enviado for editado, ele volta automaticamente a **Pendente**, para que a correção seja enviada novamente.
- JSON de importação também usa apenas os pendentes; backup continua contendo todos os registros.
- Mantidas as mesmas chaves de localStorage das versões anteriores, preservando os apontamentos já existentes.
- Service Worker/cache atualizado para V1.4.

# Apontamento de Horas V1.3 — WhatsApp direto

- Corrige o botão de envio que não reagia em Motorola e Xiaomi.
- O envio principal não usa mais `navigator.share`; abre diretamente `api.whatsapp.com` com o pacote BHAP1 preenchido.
- Mantém **Copiar pacote**, JSON e backup como alternativas.
- Service Worker atualizado para cache `apontamento-v1.3`, apagando caches antigos e buscando a versão mais recente antes do cache.
- Mantém as mesmas chaves do localStorage da V1.1/V1.2, portanto os apontamentos já salvos no aparelho são preservados.

---

# Apontamento de Horas V1.2 — Envio por texto / Xiaomi

Versão de uso pessoal do Lima. Mantém os dados e chaves locais da V1.1.

## Principal mudança
- **Enviar apontamentos pelo WhatsApp**: envia um pacote `BHAP1:` como texto, sem depender do compartilhamento de arquivo JSON do Android.
- **Copiar pacote para importação**: copia o mesmo pacote para a área de transferência.
- **Compartilhar arquivo JSON** e **Salvar JSON** continuam como plano B.
- O pacote é compatível com Banco de Horas V3.8 ou superior na tela Importar apontamentos.

## Fluxo recomendado
1. Faça os apontamentos no celular.
2. Toque em Enviar apontamentos pelo WhatsApp e envie para você mesmo.
3. No computador, copie do `BHAP1:` até o fim.
4. Banco de Horas > Importar apontamentos > Cole o pacote > Carregar pacote.
5. Confira e aprove. Nada entra oficialmente sem aprovação.

O pacote contém os mesmos dados do JSON; Base64 é apenas transporte, não criptografia.
