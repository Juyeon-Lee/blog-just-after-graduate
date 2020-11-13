---
title: QueryDSL gradle setting & fetch method 종류
comments: true
categories:
- querydsl
tags:
- gradle
- querydsl
- fetch
---

spring project에서 QueryDSL를 사용하려면 gradle 세팅을 해야한다.
했는데도 Q객체 인식이 잘 안 될 때는 윈도우 기준 
```gradlew clean build```, ```gradlew build classes```를 해주자.

그리고 쿼리를 짜던 중 fetch method에 몇가지 종류가 있어서 그 차이를 알아보았다.

<!-- more -->

## gradle QueryDSL setting

```gradle
//gradle 5 기준 build.gradle 파일
plugins {
	id 'org.springframework.boot' version '2.3.5.RELEASE'
	id 'io.spring.dependency-management' version '1.0.10.RELEASE'
	//querydsl 추가
	id "com.ewerk.gradle.plugins.querydsl" version "1.0.10"
	id 'java'
	id "com.gradle.build-scan" version "3.5"
}

group = 'com.juyeon.team'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '11'

configurations {
	compileOnly {
		extendsFrom annotationProcessor
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
	implementation 'org.springframework.boot:spring-boot-starter-mustache'
	implementation 'org.springframework.boot:spring-boot-starter-web'
	implementation 'org.springframework.boot:spring-boot-devtools'
	//implementation 'com.h2database:h2'
	implementation 'org.springframework.session:spring-session-jdbc'
	implementation 'org.springframework.boot:spring-boot-starter-oauth2-client'
	implementation 'com.querydsl:querydsl-jpa'

	implementation 'junit:junit:4.12'
	compileOnly 'org.projectlombok:lombok'
	annotationProcessor 'org.projectlombok:lombok'

	runtimeOnly 'org.postgresql:postgresql'
	testImplementation('org.springframework.boot:spring-boot-starter-test') {
		exclude group: 'org.junit.vintage', module: 'junit-vintage-engine'
	}
	testImplementation('org.springframework.security:spring-security-test')
}

test {
	useJUnitPlatform()
}

// --scan yes 동의
gradleEnterprise {
	buildScan {
		termsOfServiceUrl = "https://gradle.com/terms-of-service"
		termsOfServiceAgree = "yes"
	}
}

//querydsl 추가 시작
def querydslDir = "$buildDir/generated/querydsl"

querydsl {
	jpa = true
	querydslSourcesDir = querydslDir
}
sourceSets {
	main.java.srcDir querydslDir
}
configurations {
	querydsl.extendsFrom compileClasspath
}
compileQuerydsl {
	options.annotationProcessorPath = configurations.querydsl
}
//querydsl 추가 끝
```

다음과 같이 build.gradle 파일을 수정하고 리프래쉬를 해도 Q가 앞에 붙은 객체들이 인식이 안됐다.
그래서 찾아보니 intelliJ 안 terminal에서 프로젝트 디렉터리로 이동 후
다음과 같은 명령어를 입력해서 gradle을 새로 설정하게 했더니 인식에 성공했다.

```
gradlew clean build
gradlew build classes
```

아래 캡쳐처럼 입력하면 된다:

![image](https://user-images.githubusercontent.com/41712244/99031856-72cbc100-25bb-11eb-8bef-12a2281766b7.png)


[참고 사이트 : 인프런 질문](https://www.inflearn.com/questions/23530)

----


## fetch method 

 fetch method에 몇가지 종류가 있어서 그 차이를 알아보았다.

|Modifier and Type|Method and Description|
|------|---|
|**List<T>**|	**fetch()**|
||Get the projection as a typed List|
|**long**|	**fetchCount()**|
||Get the count of matched elements|
|**T**|	**fetchFirst()**|
||Get the first result of Get the projection or null if no result is found|
|**T**|	**fetchOne()**|
||Get the projection as a unique result or null if no result is found|
|**QueryResults<T>**|	**fetchResults()**|
||Get the projection in QueryResults form|
|**com.mysema.commons.lang.CloseableIterator<T>**|	**iterate()**|
||Get the projection as a typed closeable Iterator|

출처 : [QueryDSL document](http://www.querydsl.com/static/querydsl/4.0.8/apidocs/com/querydsl/core/Fetchable.html) 