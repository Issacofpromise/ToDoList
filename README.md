# ToDoList
ToDoList는 JavaScript 기반으로 댓글 기능이 포함된 CRUD 프로젝트이며, 
MongoDB 인증 정보를 포함한 .env 파일은 제외하고, GitHub에 push했기에 git clone해도 실행되지 않지만,
AWS Free Tier EC2 환경에서 배포·운용하고 있었고, AWS Free Tier 종료에 따라 현재 인스턴스가 중단되어있습니다.  사용자의 로그인 상태와 관리자 권한에 따라 UI와 기능을 구분하여 구현했습니다.

회원 가입, 로그인, 마이페이지(자신이 쓴 글만 표시), 리스트(전체 글 목록), 

로그인한 사용자는 자신의 게시물에만 수정·삭제 버튼이 표시되고, 다른 사용자의 게시물에는 버튼이 표시되지 않습니다.

게시된 글의 상세 화면에 달린 댓글도, 내가 쓴 댓글 옆에만 삭제 아이콘이 표시됩니다.

관리자는 모든 게시물과 댓글을 수정·삭제할 수 있습니다.

회원 등록된 계정

id: piano30 / pw : odoroizanai95*

id: ondal / pw : sooja~!ro11≫ 일반 사용자 계정.

id: admin / pw : ^^^^ 1111* -≫ 관리자 계정.

VSCode 터미널에서 npm start를 실행하면, http://localhost:3000/ 에 접속할 수 있습니다. 
npm start 명령을 실행하려면 Node.js를 설치해야 합니다.
