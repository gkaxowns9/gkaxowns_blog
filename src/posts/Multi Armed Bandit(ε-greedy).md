# Multi Armed Bandit(ε-greedy)

생성일: 2025년 4월 4일 오후 8:08
상태: 공사 중

<aside>
🚧

응용 프로그램 작품 만들다가 정리하면서 하려고 만든 페이지(근데 이건 인공지능인가)

</aside>

## Multi Armed Bandit

- 직역하자면 ***여러 팔의 도박***  쯤으로 볼 수 있을 것 같다. 실제로 이 문제는 여러 선택지(팔) 중 하나를 골라야 하는 도박꾼의 스토리를 가지고 있는 알고리즘 문제이다.
- 아래 그림으로 간단히 요약해보자

![[출처](https://myeonghak.github.io/recommender%20systems/RecSys-Multi-Armed-Bandits%28MAB%29/)](image.png)

[출처](https://myeonghak.github.io/recommender%20systems/RecSys-Multi-Armed-Bandits%28MAB%29/)

- 그니까 저 세 개의 팔(버튼) 중 하나를 눌러야 하고 각 버튼의 보상은 모른다.
이 중에서 가장 보상이 큰 버튼을 찾아서 눌러야 하는데, 이를 찾는 방식에 따라 알고리즘이 나뉜다.
- 다양한 알고리즘 중 여기서는 엡실론 그리디 알고리즘만 설명하겠다.

## **ε-greedy (엡실론 그리디)**

- 여러 MAB 알고리즘 중 하나로, **ε의 확률로 팔을 랜덤 선택하고, 아니면 가장 보상이 좋았던 팔을 선택한다.** 여기서는 이 알고리즘만 설명하고 이를 활용해서 응용 프로그래밍 주제인 음악 추천 프로그램을 만들 예정이다.
-