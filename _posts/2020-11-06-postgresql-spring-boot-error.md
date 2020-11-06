---
title: BeanCreationException jpaMappingContext entityManagerFactory error(gradle spring boot+JPA+PostgreSQL)
categories:
- postgresql
- jpa
- spring boot
- gradle
feature_text: |
  ## postgreSQL 첫 연결
  build.gradle 수정만으로 오류가 해결되는 것 같지 않을 때
  application.properties를 확인하자!
---

***스프링부트와 AWS로 혼자 구현하는 웹 서비스(이동욱 저)***를 보며 따라하던 중 초반에 여러 에러에 부딪혔다.
3.3 Spring Data JPA 테스트 코드 작성하기 부분에서
데이터베이스와 연결하면서 오류가 잘 해결되지 않았다.
(책에 나온 H2말고 나는 바로 PostgreSQL로 진행했다. 물론 PostgreSQL은 미리 설치완료했다.)

## 첫 번째 에러
Caused by: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'postsRepository' defined in com.juyeon.team.teamcoder.domain.posts.PostsRepository defined in @EnableJpaRepositories declared on JpaRepositoriesRegistrar.EnableJpaRepositoriesConfiguration: Cannot resolve reference to bean 'jpaMappingContext'

`@EnableJpaRepositories`
를 메인 application class 위에 추가해주었더니 저 에러는 없어졌지만 또 다른 에러가 발생하였다.

결론적으로 말하면 이것이 없어도 다음에 한 해결책으로 해결되는 문제였다.

## 두 번째 에러
Error creating bean with name 'entityManagerFactory' defined in class path resource

javassist 의존성을 추가하라는 분들도 있었지만, 내 경우에서는 전혀 달라지는 것이 없었다.

```gradle
// 인터넷에서 제안했던 해결책
implementation group: 'org.javassist', name: 'javassist', version: '3.15.0-GA'
```

어떤 분의 *이런 에러는 보통 application.properties의 DB 설정이 잘못된 경우이다* 라는 말씀을 보고 설마...?
하고 찾아보니... 내 application.properties에 username과 password가 입력되어 있지 않았다.

persistence.xml에서 이미 설정했었다가 persistence.xml을 사용하지 않는 것 같아 지웠었는데
머리속에서 '난 계정설정을 다 입력했어!'라고 생각했던 것이다..ㅎ

***문제의 코드***

![capture01](https://user-images.githubusercontent.com/41712244/98366629-a36da100-2077-11eb-83fd-cca46435e7a3.png)

참고 사이트:
[https://dzone.com/articles/bounty-spring-boot-and-postgresql-database](https://dzone.com/articles/bounty-spring-boot-and-postgresql-database)



> ### 잠깐!
> persistence.xml는 JPA의 설정을 관리하는 파일이다.
> Spring boot에서는 application.properties 또는 application.yml 으로 관리한다.

----

그 후 테스트코드가 잘 실행되어 정말 시원했다.

아래는 나와 비슷한 환경인 사람들을 위한 코드이다.
나의 환경은 다음과 같다.
- jdk 11
- spring 2.3.5
- junit 4.12
- gradle 5.6.4
- PostgreSQL 13
- windows 10
- IntelliJ

```
// application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/teamcoder
spring.datasource.username=postgres
spring.datasource.password=cnlQh0831

spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=create
spring.jpa.properties.hibernate.dialect = org.hibernate.dialect.PostgreSQLDialect
```

```gradle
// build.gradle
plugins {
	id 'org.springframework.boot' version '2.3.5.RELEASE'
	id 'io.spring.dependency-management' version '1.0.10.RELEASE'
	id 'java'
	id "com.gradle.build-scan" version "3.5"
}

group = 'com.juyeon.team'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '11'

repositories {
	mavenCentral()
}

dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-web'
	implementation 'junit:junit:4.12'
	compile 'org.projectlombok:lombok'
	compile 'javax.xml.bind:jaxb-api:2.3.0'

	implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
	implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
	implementation 'org.springframework.boot:spring-boot-starter-web'
	runtimeOnly 'org.postgresql:postgresql'
	testImplementation('org.springframework.boot:spring-boot-starter-test') {
		exclude group: 'org.junit.vintage', module: 'junit-vintage-engine'
	}
}

test {
	useJUnitPlatform()
}

// gradle --scan yes 동의
gradleEnterprise {
	buildScan {
		termsOfServiceUrl = "https://gradle.com/terms-of-service"
		termsOfServiceAgree = "yes"
	}
}
```