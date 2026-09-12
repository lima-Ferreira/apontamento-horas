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
