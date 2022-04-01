## Teste Prático Back-end Pleno MOS.gg


A seguir serão descritas as especificações e requisitos para a realização do teste prático para se tornar um Desenvolvedor Back-end Pleno na plataforma MOS.gg.

### Introdução

Sistema para listagem de streamers (com autenticação).

Desenvolva uma **RESTFul API** expondo 2 endpoints: um destinado a listar streamers e o outro simulando um follow à um streamer. A API deverá ser desenvolvida em **Node.js**, em qualquer framework de sua preferência. 

Para que os usuários possam realizar suas operações eles devem estar autenticados no sistema. Utilize **JWT** (*JSON Web Token*) para controle de autenticação gerando um Token com **5 MINUTOS** de expiração.

### Dados

Disponibilizamos neste repositório um banco de dados SQLite com alguns dados falsos já inseridos. Neste banco existe 2 tabelas: **users** e **channels**, sendo a tabela users a tabela pré-alimentada.

#### Entidades

-	**Users**
	-	Id
	-	experience
	-	points
	-	queue
	-	follow_ticket
	-	twitch_id
	-	twitch_name
	-	view_count
	-	profile_image
	-	email
	-	password
	-	created_at
	-	updated_at

*As seis primeiras e as duas últimas colunas da tabela users já estarão alimentadas.*

-	**Channels**
	-	Id
	-	user_id
	-	game_name
	-	title
	-	language
	-	created_at
	-	updated_at

### Sua tarefa é desenvolver os serviços abaixo:

- Criar o endpoint /signup para cadastro aceitando email e password;
- Criar o endpoint /login para autenticação no sistema;
- Buscar na API da Twitch os usuários disponibilizados no banco de dados e salvar seus respectivos nomes da Twitch, contagem de visualizações e imagem de perfil nos campos da tabela users no banco de dados;
- Buscar os dados do canal de cada usuário disponibilizado no banco de dados e salvar os resultados nos campos da tabela channels no banco de dados. Os dados do canal solicitados são: nome do jogo, titulo e lingua;
- Criar o endpoint /streamers na sua API que retorna os resultados mergeados das duas tabelas acima de forma paginada contendo 10 resultados por página, ordenando esses resultados pela seguinte ordem: queue, points, experience e created_at. Nessa lista, é necessário que todos os streamers com o campo follow_ticket = 0 sejam ocultados;
- Criar o endpoint /follow aceitando o id de um usuário como parâmetro. Ao executar esse endpoint com o id de um respectivo usuário, o sistema deve decrementar o valor de queue.

**Com exceção das rotas /signup e /login, todas as rotas restantes devem ser autenticadas por um token JWT.**

### Informações sobre a ordenação:

Os usuários devem se manter nas posições originais da fila até que a contagem da coluna queue, do respectivo usuário, chegue a 0. Após isso, o usuário deve ser levado para o final da fila, dando a oportunidade de outros streamers alcançarem visibilidade até que eles também tenham esgotado o seu número de follows dentro da contagem da coluna queue.

#### Exemplo de caso de uso:

Inicialmente todos os usuários terão o coluna `queue` com o valor 10:
```
+---------------+-------+------------+-------------------------------------+------------+
|twitch_name    |points |experience  |created_at                           |queue       |
+---------------+-------+------------+-------------------------------------+------------+
|mabel          |50     |1200        |2022-02-08 18:55:59.523000 +00:00    |10          |
|joão           |10     |1540        |2021-12-07 20:18:23.507000 +00:00    |10          |
|kaka           |5      |600         |2021-12-07 20:34:11.821000 +00:00    |10          |
|miller         |20     |5           |2021-12-07 20:34:11.821000 +00:00    |10          |
+---------------+-------+------------+-------------------------------------+------------+
```

Caso uma pessoa siga a mabel será subtraído 1 de seu `queue`, porém, como o valor de `points` de mabel são maiores do que os valores dos outros usuários, sua posição se mantém:
```
+---------------+-------+------------+-------------------------------------+------------+
|twitch_name    |points |experience  |created_at                           |queue       |
+---------------+-------+------------+-------------------------------------+------------+
|mabel          |50     |1200        |2022-02-08 18:55:59.523000 +00:00    |9           |
|joão           |10     |1540        |2021-12-07 20:18:23.507000 +00:00    |10          |
|kaka           |5      |600         |2021-12-07 20:34:11.821000 +00:00    |10          |
|miller         |20     |5           |2021-12-07 20:34:11.821000 +00:00    |10          |
+---------------+-------+------------+-------------------------------------+------------+
```

Caso o valor de `queue` de mabel chegue a 0 (zero), mabel cairia para a última posição:
```
+---------------+-------+------------+-------------------------------------+------------+
|twitch_name    |points |experience  |created_at                           |queue       |
+---------------+-------+------------+-------------------------------------+------------+
|joão           |10     |1540        |2021-12-07 20:18:23.507000 +00:00    |10          |
|kaka           |5      |600         |2021-12-07 20:34:11.821000 +00:00    |10          |
|miller         |20     |5           |2021-12-07 20:34:11.821000 +00:00    |10          |
|mabel          |50     |1200        |2022-02-08 18:55:59.523000 +00:00    |0           |
+---------------+-------+------------+-------------------------------------+------------+
```

Caso o valor na coluna `points` de mabel seja menor que o valor `points` de joão, mabel ficaria na segunda posição, mesmo mabel tendo um valor de `experience` maior.
```
+---------------+-------+------------+-------------------------------------+------------+
|twitch_name    |points |experience  |created_at                           |queue       |
+---------------+-------+------------+-------------------------------------+------------+
|joão           |60     |1540        |2022-02-08 18:55:59.523000 +00:00    |10          |
|mabel          |50     |1600        |2021-12-07 20:18:23.507000 +00:00    |9           |
|kaka           |5      |600         |2021-12-07 20:34:11.821000 +00:00    |10          |
|miller         |20     |5           |2021-12-07 20:34:11.821000 +00:00    |10          |
+---------------+-------+------------+-------------------------------------+------------+
```

## Processo de submissão

Disponibilize o sistema em um **container Docker** de forma que possamos rodar o container em nossa máquina. 
Por gentileza, crie um READ.me contendo todas as instruções para rodar o projeto. 

O teste deve ser **versionado e disponibilizado no GitHub do candidato**.  
Enviar o link para [mosggoficial@gmail.com](mailto:mosggoficial@gmail.com) até o dia **05/04/2022**.


Boa sorte a todos e  
Bom trabalho!!
