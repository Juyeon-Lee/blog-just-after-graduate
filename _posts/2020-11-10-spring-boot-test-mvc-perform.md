---
title: Spring boot test MockMvc perform APPLICATION_JSON_UTF8 deprecated
categories:
- test
- spring boot
tags:
- MockMvc
- perform
- contentType
- springboottest
---

***스프링부트와 AWS로 혼자 구현하는 웹 서비스(이동욱 저)***를 보며 따라하던 중
5.7 기존 테스트에 시큐리티 적용하기 부분에서
SpringBootTest에 MockMvc를 합치는 데 책의 코드는 오래된 버전이라
deprecated된 코드가 있었다. 그래서 업그레이드를 해본 내용을 기록해보겠다.

<!-- more -->

나의 환경(좌측)과 책의 환경(우측)은 다음과 같다.
- jdk 11            jdk 8
- spring 2.3.5      spring 2.1.7
- gradle 5.6.4      gradle 4.x
- junit 4.12        junit 4.12
- PostgreSQL 13
- windows 10
- IntelliJ

책의 원래 코드 : [깃허브 원본 코드](https://github.com/jojoldu/freelec-springboot2-webservice/blob/master/src/test/java/com/jojoldu/book/springboot/web/PostsApiControllerTest.java)

```java
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class PostsApiControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private PostsRepository postsRepository;

    @Autowired
    private WebApplicationContext context;

    private MockMvc mvc;

    @Before
    public void setup() {
        mvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @After
    public void tearDown() throws Exception {
        postsRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles="USER")
    public void Posts_등록된다() throws Exception {
        //given
        String title = "title";
        String content = "content";
        PostsSaveRequestDto requestDto = PostsSaveRequestDto.builder()
                .title(title)
                .content(content)
                .author("author")
                .build();

        String url = "http://localhost:" + port + "/api/v1/posts";
        // 이부분 변화 예정

        //when
        mvc.perform(post(url)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(new ObjectMapper().writeValueAsString(requestDto)))
                .andExpect(status().isOk());

        //then
        List<Posts> all = postsRepository.findAll();
        assertThat(all.get(0).getTitle()).isEqualTo(title);
        assertThat(all.get(0).getContent()).isEqualTo(content);
    }

    @Test
    @WithMockUser(roles="USER")
    public void Posts_수정된다() throws Exception {
        //...중략...
    }
}
```

이대로 코드를 작성하였는데 APPLICATION_JSON_UTF8가 deprecated되었다고 메시지가 떴다.

여러 시행착오를 거치고 폭풍 검색을 한 결과
[올라와 있던 질문-답변](https://stackoverflow.com/questions/17143116/integration-testing-posting-an-entire-object-to-spring-mvc-controller) 
다음과 같이 고쳤더니 잘 실행되었다.

```java
        String url = "http://localhost:" + port + "/api/v1/posts";
        String json = new ObjectMapper().writeValueAsString(requestDto);
        RequestBuilder requestBuilder = MockMvcRequestBuilders.post(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json);

        //when
        mvc.perform(requestBuilder).andExpect(status().isOk());

```

----

그리고 책에서는 application.properties는 기본으로 test할 때 가져오지만
따로 설정한 application-oauth.properties는 가져오지 않으므로 오류가 나서
src/test/resources 에 application.properties를 테스트용으로 만들어서 사용하라고 했다.

하지만 나는 그렇게 하지 않았는데도 테스트가 잘 실행되었다.
그 근거 자료를 찾으려고 열심히 검색했지만 정확한 이유는 아직 찾지 못했다..ㅜㅜ
아마도 spring2.2.x/gradle 5.x 이상부터는 자동으로 설정들을 import 해주는 것 아닌가 한다.
(정확한 이유를 알고 싶다..!!)