# 지뢰찾기 Minesweeper

<p align="center"><img src="https://user-images.githubusercontent.com/40906871/143425700-6a551bc4-0e5d-4097-86a0-44ebee6c95a7.JPG" height="400"/><img src="https://user-images.githubusercontent.com/40906871/143425699-118edb42-cf06-4813-9bc7-9bdd492f8bca.JPG" height="400"/></p>

## About the Project

### Purpose

- 자주 플레이했던 윈도우 내장 '지뢰찾기' 게임을 웹으로 구현해본다.
- 겉으로는 단순해 보여도 내부 구현은 쉽지 않다는 것을 몸소 깨닫는다.
- 외부 라이브러리 없이 단순 js 만으로 게임을 구현해본다.

### Deploy

- Tool : Github Pages
- https://d5br5.github.io/GAME_Minesweeper/

### Built with

- HTML
- CSS
- Javascript

## Details


### Main

- 최초 맵의 크기(x, y)와 지뢰의 개수(z)를 입력받는다. (5<= x,y <= 30, 0 <= z <= x \* y)
- 입력 받은 값에 맞게 지도가 생성된다.

<p align="center"><img src="https://user-images.githubusercontent.com/40906871/143425705-06a8e417-e950-4767-81fb-63b97b637794.JPG" height="200"/></p>

### start & play

- cell left click
  - 지뢰가 있을 경우 게임이 종료, 지뢰가 없을 경우 해당 셀을 열어준다.
- cell right click
  - 깃발이 세워진다. 남은 지뢰의 개수표시가 1 감소한다. 실제 지뢰 여부와 관계없다.
- cell open
  - 해당 셀 기준 주변 8칸의 지뢰 개수합을 보여준다.
  - 주위 셀의 지뢰의 합이 0일 경우, 주위 셀 전부가 열린다. 이는 재귀적으로 반복된다.
- game clear
  - 지뢰가 없는 셀이 전부 오픈될 경우, 게임이 종료된다.
  - play time과 함께 축하 문구가 alert 된다.

<p align="center"><img src="https://user-images.githubusercontent.com/40906871/143425695-ef5d0433-9eb8-4fae-91dd-b99604306f98.JPG" height="120"/></p>
  
- game over

  - 지뢰 셀을 오픈할 경우, 게임이 종료된다.
  - game over되었다는 내용의 문구가 alert 된다.

  <p align="center"><img src="https://user-images.githubusercontent.com/40906871/143425693-8348b922-c9a2-4773-acbb-812854b9ac2f.JPG" height="120"/></p>

- cell mouse hover
  - 현재 마우스가 위치한 칸이 미클릭 셀일 경우, 초록색으로 표시된다.
- play time
  - 맵이 생성된 이후 흘러간 시간을 표시한다. 60분을 넘길 경우 시간(h) 부분도 추가로 표시된다.
- count board
  - 남은지뢰 개수와 안전한 셀 개수를 표시한다.
  - 남은 지뢰 = 초기 설정한 지뢰 수 - 깃발 수
  - 안전한 셀 = 전체 칸 - 초기 설정 지뢰수 - 오픈 셀 수
- remap
  - 지도 크기, 지뢰 개수를 초기화한다. 최초 설정 화면으로 돌아간다.
- restart
  - 같은 맵 크기, 같은 지뢰 개수로 맵을 재생성한다. 시간은 초기화한다.

<p align="center"><img src="https://user-images.githubusercontent.com/40906871/143425700-6a551bc4-0e5d-4097-86a0-44ebee6c95a7.JPG" height="400"/><img src="https://user-images.githubusercontent.com/40906871/143425699-118edb42-cf06-4813-9bc7-9bdd492f8bca.JPG" height="400"/></p>
