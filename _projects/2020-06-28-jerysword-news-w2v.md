---
projectName: 단어 유사도 추정 인공신경망 이용, 뉴스 기사 분석&시각화 웹 애플리케이션
directory: Python-Django 웹 애플리케이션
projectSummary: |
  타자 실력을 게임의 형태로 재미있게 향상시키기 위한 프로그램입니다.
  본인 포함 4명의 학부생이 졸업 프로젝트로 함께 작업하였습니다.
  하단의 공개용 github repository도 보실 수 있습니다.
projectPeriod: 20.03.02 - 20.06.26
totalNum: 4
myRole: |
  유사도 추정 인공신경망
  [scrapy를 이용한 연합뉴스 크롤링/ 유사도 측정 기능(2인작업)]
  클래스 디자인,
  웹 백엔드[전체 연결, 검색 및 결과화면 동작, 예외처리, 프론트 django와 연동, search.py 구현],
  DB 디자인, 구현

skills:
- Python 3.7.6
- Django 3.0.7
- SQLite
- GitHub
- Scrapy
- w2v
- PythonAnywhere
- Html, Django-Template-Language
- Ajax
- Pycharm

mainImage: "/assets/img/portfolio/jerysword/main.png"
links: 
- "https://github.com/Juyeon-Lee/Jerys_word_ver_server.git"
image_sliders:
- slider1
---

### &#91;동기 및 목적&#93;
 기존 포털 사이트 뉴스 검색 시, 뉴스 목록의 관련도 수치가 불분명하고 특정 언론사로만 편중되기도 하는 기사 목록에 불편함을 느끼고 / 댓글로 존재하는 사람들의 반응을 '한 눈에' 살펴보기 어려웠습니다.  
 그래서 저희 팀은 검색어에 대한 유사도 높은 기사를 보여주고 댓글 반응의 변화까지 한 눈에 볼 수 있는 서비스를 기획했습니다.  

### &#91;주요 기능&#93;
* 인공신경망으로 기사와 키워드 간의 "유사도"를 측정하여 명시하고,
* 입력한 키워드로 유사한 키워드를 도출하여 검색 결과 범위를 제한했으며,
* 다양한 언론사의 기사를 검색하도록 하며,
* 댓글 추이를 분석하여 워드클라우드 이미지를 생성하였습니다.

### &#91;구조도&#93;
(옆으로 넘기는 버튼을 클릭해보세요)

{% include slider.html selector="slider1" %}
<br>

#### &#62; 개발한 부분 세부 설명

제가 제작한 부분의 설명을 하도록 하겠습니다.
전체적이고 자세한 설명은 다음 링크의 [PPT 발표자료](https://drive.google.com/file/d/1X6xSqFrSL39se_Hv1mf0X8CIwxQTnVmM/view?usp=sharing)와 [보고서 파일](https://drive.google.com/file/d/1sUWn6kj4Zdt38sn4n2ohlwv7Q5Gqk65T/view?usp=sharing)로 보실 수 있습니다.

----

### 1. JERY's WORD의 인공신경망 모델

*단어 유사도 추정 인공신경망이란?*
=> 두 단어를 인풋으로 받아 두 단어 간의 유사도를 측정합니다. 각 단어가 함께 자주 쓰일 수록 비슷하다고 측정됩니다.
  1)	우선 연예 분야를 제외한 분야들의 기사들을 크롤링합니다. Robots.txt  규정에서 봇의 접근을 허용하고 있는 연합뉴스의 기사를 크롤링하였습니다.  
  2)	뉴스 제목과 본문 내용을 정제하기 위해 html 태그, 특수기호 등을 필터링합니다.  
  3)	형태소 분석기를 사용하여 토크나이징(문장에서 유효단어로 나눔)합니다.  
  4)	모델 저장 후 3일마다 정기적으로 추가 모델학습을 했습니다.  
  5)	학습된 모델로 Gensim - word2vec, sen2vec을 이용하여 인공신경망을 구성했습니다.  
![인공신경망 내부 데이터](/assets/img/portfolio/jerysword/w2vContents.png)

### 2. 웹 기능 흐름도

![기능 흐름도](/assets/img/portfolio/jerysword/functionFlow.png)

### 3. 메인 페이지 - 검색어 입력

![기능 흐름도](/assets/img/portfolio/jerysword/main.png)  
-> 메인페이지입니다. 검색창에 검색어를 1개 이상(복수 가능) 입력 후 엔터를 입력하면 검색이 실행됩니다.

![기능 흐름도](/assets/img/portfolio/jerysword/loading.png)  
-> 검색 후 데이터가 처리되는 동안 loading 화면을 띄웁니다. 이 과정에서 Ajax를 사용하여 처리했습니다.

![기능 흐름도](/assets/img/portfolio/jerysword/error_popup.png)  
-> 검색어에 대한 예외처리를 위한 팝업창입니다. 올바르지 못한 문자, 학습되지 않은 단어 등을 필터링하기 위함입니다.

### 4. 검색 결과 페이지 - 기사 목록

![검색 결과 페이지와 설명](/assets/img/portfolio/jerysword/resultDetail.png)  
-> 페이지에 설명을 추가한 이미지입니다.  
  1) 검색 후 word2vec을 이용해 검색어에 따른 SimTopic(유사 단어)를 10개 추출합니다.  
  2) API를 사용하여 SimTopic 당 10개씩 총 100개 기사를 추출합니다.  
  3) 중복 검사 후 기사 제목과 검색어 간의 유사도 계산(sent2vec)으로 상위 10개 기사를 추려냅니다.  
  4) 그 결과, 전처리된 기사 제목, 프리뷰와 상위 5개 SimTopic을 보여줍니다.  

----

아래 페이지의 핵심 기능들은 다른 팀원들이 제작하였습니다.

### 5. Admin페이지 - 전체 데이터 상세 조회

![Admin Page](/assets/img/portfolio/jerysword/adminDetail.png)  
  -> 관리자는 Admin(url : '/admin') 페이지를 통해 뉴스 유사도 검색, 댓글 처리 등의 기능으로 model에 저장된 데이터를 웹에서 쉽게 확인/삭제 할 수 있습니다.
  위 사진은 '흑인 시위' 두 단어를 함께 검색했을 경우에 대해서 Admin 페이지에서 볼 수 있는 예시결과 값입니다. 유사도 순으로 추출된 기사를 한눈에 확인 가능합니다. 또한 워드 클라우드 이미지, 검색한 토픽들과 같은 저장된 데이터 모두 확인 가능합니다.


### 6. 기간별 기사 조회 페이지 - 댓글 워드클라우드

![wordcloud page per period](/assets/img/portfolio/jerysword/wordcloud.png)  
  1) search.py를 통해 검색어와 관련된 기사를 WCArticle Model에 저장합니다.  
  2) Crawler 클래스를 이용해 기간별 댓글 모음.txt파일 생성합니다.  
  3) wordcloud.py 에서 형태소 분석 후 전처리합니다.  
  4) 빈도수로 정렬 후 이미지를 생성합니다.  
  5) 기간별 텍스트를 이용해 3,4번 후 3개의 이미지를 생성합니다.  
  6) DB에 저장합니다.  