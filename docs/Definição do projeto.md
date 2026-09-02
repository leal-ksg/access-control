## Título do Projeto:

Armarduino (provisório)

## Período:

01/09/2026 - 16/12/2026

## Resumo:

O projeto consiste no desenvolvimento e implantação de um sistema para controle de acesso aos armários do PIPA IFmakeRS, com o objetivo de aumentar a segurança e possibilitar diferentes níveis de permissão de acesso aos compartimentos.
A proposta envolve o levantamento das necessidades dos usuários, definição dos requisitos do sistema, elaboração do backlog, desenvolvimento do software e integração com dispositivos eletrônicos baseados em Arduino.
O sistema deverá permitir o gerenciamento dos usuários e de suas respectivas permissões, além do registro e controle dos acessos realizados. Ao final do projeto, pretende-se realizar a instalação dos componentes, testes de funcionamento, hospedagem do sistema e implantação no ambiente do PIPA.

## Justificativa:

A demanda surgiu a partir da necessidade de aumentar a segurança e melhorar o controle de acesso aos armários utilizados no PIPA IFmakeRS. Atualmente, a ausência de um mecanismo informatizado de controle pode dificultar o gerenciamento e rastreabilidade acerca de quem possui autorização para acessar determinados armários, além de limitar a possibilidade de estabelecer diferentes níveis de permissão.

Hoje, o acesso aos armários é realizado de forma manual, por meio de chaves. Entretanto, observa-se que, em algumas situações, os armários permanecem desbloqueados para facilitar o acesso e o uso diário dos equipamentos armazenados, o que pode comprometer a segurança e o controle de acesso aos compartimentos

A área envolvida compreende o gerenciamento e controle de acesso físico, associado ao desenvolvimento de sistemas e à automação por meio de dispositivos eletrônicos. O sistema será utilizado principalmente pelos responsáveis pelo PIPA, que poderão administrar usuários e permissões, e pelos usuários autorizados a utilizar os armários.

## Objetivo geral:

Desenvolver e implantar um sistema que permita diferentes níveis de controle e acesso aos armários do PIPA IFmakeRS.

## Objetivos específicos:

- Levantamento e análise de requisitos do sistema
- Identificação de necessidades dos usuários e regras de acesso aos armários
- Elaboração e organização do [backlog do projeto](https://kauagsilvaleal.atlassian.net/jira/software/projects/KAN/boards/1?filter=&groupBy=none)
- Projeção da arquitetura e funcionamento da solução
- Desenvolvimento do sistema de gerenciamento e controle de acesso
- Integração com dispositivos eletrônicos baseados em Arduino
- Instalação e configuração dos dispositivos eletrônicos nos armários
- Realização de testes funcionais e de integração entre hardware e software
- Hospedagem e configuração do sistema em ambiente adequado
- Implantação da solução
- Avaliação do funcionamento do sistema após implantação

## Metodologia:

O projeto será desenvolvido de forma incremental, dividido em etapas que permitam acompanhar a evolução da solução e validar suas funcionalidades ao longo do desenvolvimento.

Inicialmente, será realizado o levantamento de requisitos, buscando compreender as necessidades dos responsáveis pelo PIPA e dos usuários dos armários. Nessa etapa, serão identificadas as principais operações do sistema, os tipos de usuários, as regras de acesso, os requisitos de segurança e as funcionalidades necessárias.

Em seguida, será elaborado o backlog do projeto, organizando as funcionalidades e atividades de desenvolvimento de acordo com sua prioridade. A partir dos requisitos levantados, será definida a arquitetura da solução, considerando a integração entre o software e os componentes eletrônicos responsáveis pelo controle físico dos armários.

Na etapa de desenvolvimento, serão implementadas as funcionalidades de gerenciamento de usuários, controle de permissões, associação entre usuários e armários e registro dos acessos. A aplicação será desenvolvida utilizando React, NodeJS e Arduino, entre outras tecnologias e ferramentas.

Paralelamente, será desenvolvido o componente de automação e controle eletrônico, utilizando Arduino e demais componentes físicos necessários para realizar a abertura e o bloqueio dos armários. A comunicação entre o hardware e o sistema será configurada de forma a permitir que as permissões definidas no software sejam refletidas no controle físico de acesso.

Após o desenvolvimento, serão realizados testes, verificando tanto o comportamento do sistema quanto a comunicação com o Arduino e o funcionamento dos mecanismos de acesso. Também serão realizados testes envolvendo diferentes perfis de usuários e situações de acesso autorizado e não autorizado.

Por fim, será realizada a hospedagem, configuração e implantação do sistema no ambiente do PIPA IFmakeRS. Após a implantação, serão observados o funcionamento da solução e possíveis necessidades de ajustes ou melhorias.

## Resultados:

Espera-se que o projeto resulte na implantação de um sistema funcional para gerenciamento e controle de acesso aos armários do PIPA.

Como resultados quantitativos, pretende-se:

- Implantar o sistema de controle de acesso em 100% dos armários definidos no escopo do projeto;
- Permitir o gerenciamento de diferentes níveis de acesso e permissões;
- Registrar os acessos realizados pelos usuários;
- Integrar o sistema desenvolvido com os dispositivos Arduino utilizados no projeto;
- Realizar testes de funcionamento antes da implantação definitiva;
- Disponibilizar o sistema em ambiente de hospedagem adequado para sua utilização.

Como resultados qualitativos, espera-se proporcionar maior segurança, organização e controle sobre a utilização dos armários, além de facilitar o gerenciamento das permissões pelos responsáveis pelo PIPA. A solução também deverá contribuir para a aplicação prática de conhecimentos relacionados ao desenvolvimento de software, bancos de dados, automação, sistemas embarcados e integração entre hardware e software.