# Docker compose usage

- Make a copy or rename .env.exemple to .env


- Fill in the empty fields and update DATABASE_URL accordingly.
the database will be created with this fields at the first run, as is it a local and personnal database, you can enter whatever you want.

## commands:

|type| command                                                          |
|:-----|:-----------------------------------------------------------------|
|Run| `docker-compose up -d`                                           |
|Stop all| `docker-compose stop`                                            |
|Stop one| `docker-compose stop <container_name>`                             |
|Stop and destroy containers| `docker-compose down` ( this will not delete database's content)   |
|Run a command in a running container| `docker-compose exec <container_name> <command>`                   |

