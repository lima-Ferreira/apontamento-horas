# Apontamento de Horas V1.7 — WhatsApp somente BHAP1

## Novidade principal
- O botão de envio para o WhatsApp manda **somente** o pacote técnico que começa em `BHAP1:`.
- A mensagem recebida no outro celular não leva título, nome, resumo ou instruções extras.
- Assim, basta **copiar a mensagem inteira recebida no WhatsApp** e colar na tela de importação do Banco de Horas.
- Mantidos Pendentes/Enviados, Reenviar, cópia manual do pacote, JSON e backup.
- Abrir o WhatsApp marca os registros como enviados; se desistir do envio, use **Reenviar**.
- Mantidas as mesmas chaves `apontamento_v1_*`, preservando os dados já existentes no aparelho.
- Cache do PWA atualizado para `apontamento-v1.7`.

## Fluxo recomendado
1. Registre o apontamento no celular.
2. Toque em **Enviar somente o código para o WhatsApp**.
3. Envie a mensagem para o seu WhatsApp.
4. No celular/computador que recebeu, copie a mensagem inteira.
5. No Banco de Horas, abra **Importar apontamentos**, cole e carregue o pacote.
6. Confira e aprove.

A mensagem enviada terá este formato, sem nenhum texto antes ou depois:

```text
BHAP1:...
```

O conteúdo Base64 é apenas formato de transporte; não é criptografia.
