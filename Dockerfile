FROM maven:3.9.8-eclipse-temurin-17 AS build

WORKDIR /app

# Copy backend source first for better layer caching.
COPY spring-portfolio/pom.xml spring-portfolio/pom.xml
COPY spring-portfolio/src spring-portfolio/src

# Copy frontend assets that the Maven resources plugin bundles into /static.
COPY *.html ./
COPY css ./css
COPY js ./js

WORKDIR /app/spring-portfolio
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre

WORKDIR /app
COPY --from=build /app/spring-portfolio/target/spring-portfolio-1.0.0.jar app.jar

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8080}"]
