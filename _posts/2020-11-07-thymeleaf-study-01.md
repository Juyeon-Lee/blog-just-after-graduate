---
title: Thymeleaf 공식문서 공부하며 기록하기 01
comments: true
categories:
- thymeleaf
---

[thymeleaf 공식문서](https://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html)
과거에 한 번 사용해 본 적은 있지만 아직 잘 모르는 thymeleaf를 찬찬히 
다시 공부해보자!

<!-- more -->

## 3.2.1 Unescaped Text

```
our <b>fantastic</b> grocery
```
 와 같은 특수문자가 들어간 문장을 변수에 그대로 입력하고 또 그대로 출력하고 싶을 때는

 **th:text** 대신
 ```html
<p th:utext="#{home.welcome}">our grocery</p>
 ```
 와 같이 **th:utext** (unescaped text)를 이용한다.
 물론 home.welcome에 값이 전달되어야 한다.

----

## 3.2.2 변수값 보여주기

```java
//controller
public class HomeController implements IGTVGController {

    public void process(
                final HttpServletRequest request, final HttpServletResponse response,
                final ServletContext servletContext, final ITemplateEngine templateEngine)
                throws Exception {
                
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMMM yyyy");
        Calendar cal = Calendar.getInstance();

        WebContext ctx = 
                new WebContext(request, response, servletContext, request.getLocale());
        ctx.setVariable("today", dateFormat.format(cal.getTime()));

        templateEngine.process("home", ctx, response.getWriter());

    }
}
```
```html
<body>
  <p>Today is: <span th:text="${today}">13 February 2011</span></p>
</body>
```

위와 같이 controller에서 'ctx'라는 context에 변수를 담아서 'home'이라는 html파일과 함께
클라이언트로 보내는 것이다.

#과는 다르게 $를 사용하면 '변수 표현식'이라서 .으로 타고타고 들어가서 값을 얻을 수 있다.
```${user.name}```과 같이 말이다.

반대로 #은 
```home.welcome=안녕하세요?```와 같은 내용의 message properties 파일이 존재하고
thymeleaf engine에 등록이 되었다면 사용할 수 있다.
다른 페이지들에서 중복적으로 같은 내용을 출력할 때 사용하기 좋을 것 같다.

### expressions:

- Variable Expressions: ```${...}```
- Selection Variable Expressions: ```*{...}```
- Message Expressions: ```#{...}```    
- Link URL Expressions: ```@{...}```   
- Fragment Expressions: ```~{...}```    *알아보기*

```html
<div th:object="${user}">
    <p>Name: <em th:text="*{name}">Juyeon</em></p>
    <p>Age: <em th:text="*{age}">24</em></p>
</div>

```

### Literals:
변수 종류들 문자열 '로 감싸는 것, 숫자는 그대로 쓰고, true/false/null은 그대로 쓴다.
그런데 **Literal tokens: one, sometext, main,…** 은 좀더 알아보자~~

### Text operations:
- 문자열 더하기 : +
- 리터럴 대체 : ```|The name is ${name}|``` 와 같이 하면 name자리에 값이 대체가 되나보다.

### 수학, 논리 기호:
```and, or, !, not, >, >=, ==, !=, <=, <, ? : (조건연산자)```

## 4.1 Messages
```html
<p th:utext="#{home.welcome(${session.user.name})}">
  Welcome to our grocery store, Sebastian Pepper!
</p>
```
위와 같이 문장에 매개변수를 세팅할 수 있다. 위 예시에서는 유저네임을 매개변수로 받았다.

메모 : [참고할 만한 블로그](https://cyberx.tistory.com/132)

----

P.S.
django template language 랑 유사했던 Liquid(Jekyll 블로그 만드는 데 사용)에 비해서 문법이 복잡하고 익히는 데 좀 걸릴 것 같다..

지금 진행하고 있는 블로그에서는 Thymeleaf가 제일 중요하지는 않으므로 일단 Mustache로 진행해야겠다.