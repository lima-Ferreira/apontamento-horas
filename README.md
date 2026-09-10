# Apontamento de Horas V1.0

Protótipo mobile-first, sem banco online.

## Faz nesta versão
- Configuração do funcionário e loja no próprio aparelho.
- Registros salvos em localStorage.
- Data, quantidade de hora extra, motivo, companhia e observação.
- Opção de registrar início, fim e intervalo.
- Editar/excluir.
- Total das horas.
- Compartilhar resumo pelo celular/WhatsApp.
- Gerar JSON preparado para futura importação no Banco de Horas.
- ID único por apontamento para futura proteção contra duplicidade.
- Backup/restauração.
- Estrutura PWA/offline quando hospedado via HTTPS.

## Teste no Windows
Dê dois cliques em INICIAR-WINDOWS.bat.
É necessário ter Python instalado.

## Teste no Linux
Abra terminal nesta pasta:
chmod +x INICIAR-LINUX.sh
./INICIAR-LINUX.sh

Abra http://localhost:8080

## Celular
Para usar como app no celular, publique os arquivos em uma hospedagem estática HTTPS, por exemplo GitHub Pages, e use "Adicionar à tela inicial".

## Importante
Nada desta V1 entra automaticamente no Banco de Horas. O JSON será a ponte para a futura tela de conferência/importação na V2.9.


## V1.1
- “Compartilhar resumo” continua enviando o texto legível.
- “Enviar arquivo para importação” cria o JSON e abre o compartilhamento nativo do celular com o arquivo anexado, quando o navegador suporta Web Share com arquivos.
- Se o navegador não suportar, o JSON é salvo automaticamente para anexar manualmente.
- “Salvar JSON no aparelho” continua disponível como alternativa.
