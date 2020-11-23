---
projectName: NOMAD-Course-Management
directory: 자바 웹 애플리케이션
projectSummary: |
  세종대학교 창의융합노마드 과목의 관리를 도와주는 프로그램입니다.
  프로젝트 전체 진행에는 참여하지 않았지만 첫번째 달의 개발에 참여하였습니다.
  넥스트페이퍼엠앤씨에서 여름계절학기 인턴십으로 진행되었습니다.
  본인 포함 4명의 학부생이 함께 작업하였습니다.
  보안 상 github 소스코드를 공개할 수 없는 점 양해부탁드립니다.
projectPeriod: 18.07.01 - 18.07.31 
totalNum: 4
myRole: 분반 목록 & 새 분반 추가, 분반정보 관리 & 분반에 소속된 모듈 정보 수정 페이지 제작
skills:
- Java 8
- Spring Boot 2.0.4
- Gradle
- Thymeleaf
- MariaDB & JPA
- Html
- Ajax
- IntelliJ
- GitHub
mainImage: "/assets/img/portfolio/nomad/managecourse.png"
projectImages: 
- 
  url: "/assets/img/portfolio/nomad/listcourse.png"
  cap: "listcourse.html"
- 
  url: "/assets/img/portfolio/nomad/managecourse.png"
  cap: "managecourse.html"
-
  url: "/assets/img/portfolio/nomad/readPageForStudent.png"
  cap: "팀원이 만든 학생용 출결 및 성적 조회 페이지"
---

### &#91;진행 순서&#93;

* 분석 후 기능요구사항 명세서 작성
* 개발환경 결정 및 팀 환경 세팅
* UI 설계
* 테이블 디자인
* 기능별 역할 분담
* 각자 맡은 부분 제작

#### &#62; 개발 목적 : 세종대학교 창의융합노마드 과목의 관리를 도와주는 프로그램입니다.

제가 제작한 부분의 설명을 하도록 하겠습니다.

### 1. 분반 목록 & 새 분반 추가(List Course) 페이지

 처음 접하게 되는 로그인 페이지와 상단 바, 로그인 후 항상 있는 사이드바를 담은 html파일을 제작하였습니다. 참고 템플릿으로 AdminLTE를 사용하였습니다.

 mariaDB에 있는 데이터를 가져온 결과를 보여주고 있습니다. 분반 목록을 동적으로 보여주는 페이지를 만들기 위해서 thymeleaf문법을 익혔습니다. thymeleaf를 이용하여 내용을 다루는 코드는 한 번만 나옵니다. 인터넷에서 접속할 때는, 아직 다른 페이지가 완성되지 않았기 때문에 페이지 검사를 위해서 ‘localhost/home/list/course’로 접속하였습니다.

### 2. 분반정보 관리 & 분반에 소속된 모듈 정보 수정(Manage Course) 페이지

 분반정보가 그대로 나오고 수정정보를 입력한 상태에서 저장을 누르면 저장이 되고 다시 같은 페이지가 뜹니다. 한 번에 여러 정보가 바뀔 수도 있는 분반 정보 수정을 위해서 ajax를 사용하였습니다. 또한 모듈정보를 수정하고 저장을 눌러도 저장이 되고 같은 페이지가 뜹니다. 교수님 입력 박스는 여러 분이 같이 입력되고 처리돼야 하기 때문에 배제하고 제작하여 아직 동적으로 처리하지는 않았습니다. (추후 저의 참여가 끝나고 연동되었습니다.)


#### 다른 팀원들이 구현한 다른 기능들 : 

회원가입, 내계정관리, 학생선등록, 남계정관리, 모듈관리, 출석/과제 점수보기, 출
석수정, 과제점수 수정, 학생용 모듈 선택하기, 희망모듈 신청하기

