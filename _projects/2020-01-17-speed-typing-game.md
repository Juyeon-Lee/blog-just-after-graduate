---
projectName: Speed-Typing-Game
directory: C++ 서버-클라이언트 구조 애플리케이션
projectSummary: |
  타자 실력을 게임의 형태로 재미있게 향상시키기 위한 프로그램입니다.
  본인 포함 4명의 학부생이 함께 작업하였습니다.
  하단의 공개된 클라이언트용/서버용 github 소스코드도 보실 수 있습니다.
projectPeriod: 20.01.06 - 20.01.15
totalNum: 4
myRole: |
  초기 UI 디자인(컨트롤 및 멤버변수), 
  서버 및 클라이언트 UI 초기 제작,
  MatchGame(대결)[OnReceive(), scatterStrToWords(), IsGameEnd(), staticStringToIndex(), EraseCheck()],
  서버 클라이언트 초기 통신,
  최종 발표

skills:
- C++
- MySQL & ODBC
- Visual Studio 2017
- GitHub
mainImage: "/assets/img/portfolio/speedgame/solo_kor.png"
projectImages: 
-
  url: "/assets/img/portfolio/speedgame/match.png"
  cap: "클라이언트와 서버에서 각각 게임대결하는 모습"
links: 
- "https://github.com/Juyeon-Lee/SpeedTyingGame.git"
- "https://github.com/Juyeon-Lee/SpeedTypingGameSVR.git"
image_sliders:
- slider2
---

----

### &#91;구조도&#93;
(옆으로 넘기는 버튼을 클릭해보세요)
{% include slider.html selector="slider2" %}

----

#### &#62; 개발 목적 : C++ 서버-클라이언트 구조 데스크탑 애플리케이션

제가 제작한 부분의 설명을 하도록 하겠습니다.
전체적이고 자세한 설명은 다음 링크의 [보고서 파일](https://drive.google.com/file/d/19YpK04k6xpnzyJIiMu_lmdGqMdCi4WdR/view?usp=sharing)로 보실 수 있습니다.

----

### 1. 대결 게임 페이지 - 클라이언트 기능 작성

![클라이언트와 서버에서 각각 게임대결하는 모습](/assets/img/portfolio/speedgame/match.png)
1)	접속 전에는 화면에 유효한 단어들이 출력되어 있지 않고, 입력창도 활성화가 되어 있지 않다.  
2)	클라이언트에서 접속 버튼을 누르면 ip주소를 입력할 수 있는 창이 나오며 ip입력 후 접속이 성공했다면 메시지박스에 접속성공이 뜨며 상대편 static 접속에 접속성공으로 상태가 바뀐다.  
3)	서버는 접속이 되면 상대편 static에 접속 중이라고 뜨며 상대와 같은 랜덤단어가 뷰에 뜨게 되어 게임이 시작된다.  
4)	게임은 15개의 단어를 없애는 것으로 각 유저가 단어 한 개를 없앨 때마다 점수는 1점씩 올라간다.  
5)	한 쪽에서 없앤 단어는 상대편 뷰에서도 없어진다.  
6)	게임이 끝난 후 승/패가 점수에 따라 달라지게 되며 클라이언트 유저의 점수만 데이터베이스에 저장된다.  

----

아래의 기능들은 다른 팀원들이 제작하였습니다.

### 2. 회원등록 / 로그인 / 로그아웃 페이지

![클라이언트 프로그램 메인화면](/assets/img/portfolio/speedgame/main_client.png)
![클라이언트 프로그램 로그인화면](/assets/img/portfolio/speedgame/login.png)
![서버 프로그램 메인화면](/assets/img/portfolio/speedgame/main_server.png)

  1)	클라이언트는 총 6개의 버튼으로 이루어져 있으며, 로그인이 되지 않을 시 다른 메뉴를 사용할 수 없다.   
  2)	로그인 후에는 상태가 “[USER NAME]이 사용중입니다”로 바뀌며 버튼들을 누르면 각각에 대응하는 뷰로 연결된다.  
  3)	서버의 경우 대결 게임만을 가능하게 만들었으며, 클라이언트에서 접속요청이 오면 사용 가능하다.  
  4)  회원 등록 시 아이디와 비밀번호 입력 후 등록 버튼을 누르면 회원정보가 데이터베이스에 저장되며 이미 존재하는 회원인지를 확인한다.  
  5)	로그인 시 아이디와 비밀번호 입력 후 로그인 버튼을 누르면 회원정보가 일치한지에 대한 검사가 이루어지며, 맞으면 상태와 회원이름이 표시되고, 틀리면 메시지박스가 나타나 회원이 아님을 알려준다.  

### 3. 연습 게임 페이지

![클라이언트 프로그램 연습게임 화면](/assets/img/portfolio/speedgame/solo_kor.png)
  1)	메인 뷰에서 한글 연습/ 영어 연습 버튼을 통해 원하는 언어의 버전으로 타자 게임을 할 수 있다.  
  2)	각 게임의 단어는 데이터베이스 테이블 WORD, ENGLISH에 저장되어 있으며 데이터베이스 쿼리문의 랜덤함수로 인해 중복 없이 랜덤단어 15개를 받아와 뷰에 보인다.  
  3)	게임 종료 시 걸린 시간이 화면에 메시지 박스로 표시된다.  


### 4. 점수 확인 페이지

![유저들의 점수 현황 화면](/assets/img/portfolio/speedgame/score.png)
  1)	점수는 대결 게임 후 클라이언트의 점수만이 저장되며 사용자 id, 점수, 입력 일자가 데이터베이스에 저장되고 뷰에 보인다.  
  2)	각 유저는 자신의 아이디 검색을 통해 자신만의 점수를 확인할 수 있다.  


