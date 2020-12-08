---
projectName: Team Coder (코딩팀 모집) 웹 애플리케이션
directory: Java-Spring Boot 웹 애플리케이션
projectSummary: |
  코딩을 같이 할 팀원 모집을 위한 웹 사이트입니다.
  JPA, Spring, Spring Data JPA, PostgreSQL, AWS Hosting 학습을 목표로 개발한 개인 프로젝트입니다.
  하단의 공개용 github repository도 보실 수 있습니다.
projectPeriod: 20.11.01 - 20.12.07
totalNum: 1
myRole: |
  전체 구현,
  사이트 기획,
  테이블 모델링,
  UI디자인,  
  JPA와 QueryDSL 이용, 
  Oauth2.0 로그인 연동(구글, 네이버, 카카오), 
  테스트코드 작성, 
  이슈기반 브랜치 생성 및 병합, 
  AWS 호스팅, 
  Travis CI를 이용한 배포 자동화, 
  Nginx를 이용한 무중단 배포
  
skills:
- Java 11
- Spring 2.3.5
- junit 4.12
- JPA
- QueryDSL
- PostgreSQL 12
- GitHub
- AWS EC2, S3, RDS
- Nginx 1.18.0
- Travis CI
- Html, Thymeleaf, css
- Javascript, Ajax
- IntelliJ

mainImage: "/assets/img/portfolio/teamcoder/main.png"
links: 
- "https://github.com/Juyeon-Lee/Team-Coder.git"
- "https://teamcoder.co.kr"
image_sliders:
- teamcoder_slider
---

### &#91;동기 및 목적&#93;
 코딩 팀원을 모집하는 것만을 위한 인터넷 공간이 없다고 생각했고 재학 중에 아쉬움을 느꼈습니다. 그래서 내가 원하는 조건과 프로젝트로 팀을 모집할 수 있게 도와주는 사이트를 제작하려 했습니다. 그 과정에서 JPA, Spring, AWS Hosting, PostgreSQL 학습을 주요 목표로 두고 작업했습니다. 기초 틀 제작에 ***스프링부트와 AWS로 혼자 구현하는 웹 서비스(이동욱 저)***를 보고 많은 도움을 받았습니다. 그 책에서 AWS 배포와 Travis, Nginx 사용 방법도 많은 도움을 받았습니다. (이동욱 저자님 감사합니다!)

### &#91;주요 기능&#93;
*  코딩스터디 그룹을 만들고 팀원을 모집할 수 있습니다.
*  프로젝트 그룹을 만들고 팀원을 모집할 수 있습니다.
*  최대 팀 인원 수와 팀원 자격을 지정할 수 있습니다.
*  그룹의 설정이나 해시태그로 그룹을 검색할 수 있습니다.
*  사용자는 사이트에 회원가입, 로그인을 할 수 있습니다.
*  사용자는 자신의 기본 정보를 등록, 수정할 수 있습니다. 

### &#91; 유스케이스 / 구조도 / ERD &#93;
(옆으로 넘기는 버튼을 클릭해보세요)

{% include slider.html selector="teamcoder_slider" %}
<br>

#### &#62; 세부 설명

핵심 기능 설명을 하도록 하겠습니다.
전체적이고 자세한 설명은 다음 링크의 [PPT 발표자료](https://drive.google.com/file/d/1GVxnB8SfwNNkbsg6sN4f0IoTB2O6q2s0/view?usp=sharing)로 보실 수 있습니다.

----

### 1. 사이트 이용 권한 설정


*  USER : 회원가입 후 추가정보 입력까지 마친 사용자로,

그룹 생성 및 관리, 그룹 세부 정보 열람, 그룹 참가 신청, 그룹 파일 업로드 등은 USER만 할 수 있습니다.
*  GUEST : 회원가입을 한 사용자로,

그룹 저장, 사용자 세부 정보 열람, 내정보 수정, 탈퇴, 사용자 사진 업로드 등을 할 수 있습니다.
*  ALL : 개인정보 처리방침열람, 그룹 검색, 로그인/로그아웃을 할 수 있습니다.

----

### 2. 메인 페이지

![메인 페이지](/assets/img/portfolio/teamcoder/main_total.png)  
-> 상단에 핵심 페이지로 이동할 수 있는 네비게이션 바가 있습니다. 중앙에 검색 위젯에선 조건을 입력 후 그룹을 검색할 수 있습니다. 그 밑에는 전체 그룹이 출력됩니다. 아직 페이지 처리는 하지 않았습니다. 하단에는 사이트 정보를 볼 수 있습니다. 그 중, 개인정보 처리방침 페이지 링크가 있습니다.

### 3. 로그인 페이지

![로그인 페이지](/assets/img/portfolio/teamcoder/logoption.png)  
-> 구글 / 네이버 / 카카오 계정으로 회원가입, 로그인이 가능합니다.

로그인 후에는 같은 링크로 접속 시 로그아웃 버튼이 표시됩니다.

### 4. 사용자 정보 페이지

![사용자 정보 페이지](/assets/img/portfolio/teamcoder/userInfo.png)  
-> 사용자 추가정보 수정 페이지 입니다. 이름, 관심분야 태그, 탄생년도, 최종학력, 지역, 프로필 사진 등을 입력할 수 있습니다.

### 5. 사용자 상세 정보 열람 페이지

![사용자 상세정보](/assets/img/portfolio/teamcoder/userDetail.png)
-> 사용자 상세 정보를 열람하는 페이지입니다.

### 6. 소유 그룹 관리 페이지

![소유 그룹 관리](/assets/img/portfolio/teamcoder/groupManage.png)
-> 새 그룹을 생성하는 페이지로 이동할 수 있으며, 소유 그룹 리스트를 볼 수 있고 그룹 정보 수정/그룹 참가신청자 페이지로 이동할 수 있습니다.

### 7. 소유 그룹 생성/수정 페이지

![소유 그룹 수정](/assets/img/portfolio/teamcoder/group_update.png)
-> 최초 생성 시에는 관련 문서를 입력하는 란이 없습니다. 그룹 이름, 활동 목적, 관심분야 태그, 최대 인원, 나이제한, 활동 예정일, 희망 최저학력, 활동희망 지역, 추가설명, 관련 문서를 입력할 수 있습니다.

### 8. 그룹 상세 정보 열람 페이지

![그룹 상세정보](/assets/img/portfolio/teamcoder/groupDetail.png)
-> 그룹 상세 정보를 열람하는 페이지입니다. **매니저 정보** 클릭 시 매니저 상세정보 열람 페이지로 이동할 수 있습니다. 페이지 하단에 **저장하기**버튼을 누르면 저장함에 저장이 되며 저장함 페이지에서 볼 수 있습니다. 또한 **참여신청하기** 버튼을 누르면 참여코멘트 입력 창이 나타나며, 한 번 더 버튼을 누르면 참여신청이 완료됩니다.

### 9. 그룹 저장함 페이지

![그룹 저장함](/assets/img/portfolio/teamcoder/storage.png)
-> 저장한 그룹 리스트를 볼 수 있습니다. 그룹 이름 클릭시 그룹 상세정보 페이지로 이동할 수 있습니다. **저장소에서 삭제하기** 버튼을 누르면 저장소에서 삭제됩니다. **신청하기** 버튼을 누르면 그룹 상세정보 페이지로 이동 후 참여 신청을 할 수 있습니다.

### 10. 참가신청한 그룹 페이지

![참가 신청한 그룹](/assets/img/portfolio/teamcoder/applyList.png)
-> 그룹 이름 클릭시 그룹 상세정보 페이지로 이동할 수 있습니다. 현재 상태(신청함/승인됨/거절됨)가 표시되며 **취소하기/나가기** 버튼을 누르면 신청/참가를 취소할 수 있습니다.

### 11. 참가 신청한 사용자 페이지
![참가 신청한 사용자 목록](/assets/img/portfolio/teamcoder/applyUsers.png)
-> 매니저가 소유한 그룹에 참가신청을 한 사용자들을 볼 수 있습니다. **거절하기** 버튼과 **승인하기** 버튼을 누르면 해당 기능이 수행되며 사용자의 참여상태가 '신청함'에서 '거절됨'/'승인됨'으로 바뀝니다.

### 12. 그룹 검색 페이지
![그룹 검색](/assets/img/portfolio/teamcoder/searchResult.png)
-> 검색 조건 (**목적/기간/나이/지역/태그**)을 입력 후 검색하면 조건을 만족하는 그룹을 검색하여 결과를 볼 수 있습니다. **자세히 알아보기** 버튼이나 그룹 이름을 클릭하면 그룹 상세정보 페이지로 이동합니다.