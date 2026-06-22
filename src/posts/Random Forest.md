# Random Forest

생성일: 2026년 2월 6일 오전 12:44
상태: 정리 완료
태그: 파이썬, 머신러닝, Decision Tree, 앙상블

## Random Forest란?

- Random Forest 는 분류와 회귀에 사용되는 지도학습 알고리즘으로, **여러 개의 의사결정나무(Decision Tree)를 조합한 앙상블 모델**이다.
  단순하게 설명하자면, **수도 없이 많은 조건문들을 만들고 이를 합치는 모델**이다.

![이 밈의 주인공이 바로 이 친구이다.](image.png)

이 밈의 주인공이 바로 이 친구이다.

- 아마 많은 사람들이 Scikit Learn에서 이 Random Forest를 사용해 봤을 것이다.
  하지만 이 원리에 대해서는 깊게 알기 어렵기 때문에 이에 대해 설명해 보고자 한다.

### **Decision Tree**

- 위에서 Random Forest는 여러 개의 **의사결정나무(Decision Tree)**를 사용한다고 했다.
  의사결정나무는 일련의 if-else로 이루어진 나무모형이다.

![image.png](image%201.png)

- 의사결정나무는 **탐욕적 재귀 분할(Greedy Recursive Partitioning)** 알고리즘으로 만들어진다.
  이 알고리즘은 현재 노드에서 전역 최적점(global optimum)를 선택하여 매 단계에서 가장 성능 개선이 큰 분할을 선택한다.
- 여기서 전역 최적점이라는 것은 단순하게 말하자면 **Error Function의 Output 값이 가장 작은 해를 의미**하며, **분류(Classification)의 경우 Gini와 Entropy**를 사용하고, **회귀(Regression)의 경우 MSE**를 사용한다.
- 해당 알고리즘의 간단한 알고리즘을 나타내면 아래와 같다.
  1. 전체 데이터를 Root에 배치한 후, Feature Subsampling 한다. (Random Forest 기준)
  2. 랜덤으로 선택된 Feature들로 분할 후보들을 만든다.
  3. 각 분할 후보들은 Error Function을 통해 Gain 값을 구한다. (아래 식 참고)
     $Gain=Error(Root)−(\frac{n_L}{n}Error(L)+\frac{n_R}{n}Error(R))$
     ($n$은 현재 노드에 포함된 샘플 수를 의미)
  4. Gain 값이 가장 큰 후보를 선택한다. (Greedy)
  5. 각 자식 노드에 대해 동일한 과정을 재귀적으로 반복한다. (Recursive)
  6. 최대 깊이나 최소 샘플 수에 도달하는 등의 조건을 만족하면 재귀를 멈춘다.

### Bagging

- 위에서 Random Forest는 앙상블 모델이라고 했다. 이 앙상블이 무엇인지 알아보자.
- 앙상블이란, **여러 개의 모델을 조합하여 더 강력하고 안정적인 예측 모델을 만드는 기법**이다.
  다양한 종류의 의사결정트리들을 사용하기 때문에 다양한 오차가 발생하고, 그런 값을 조합하여 더 높은 예측 성능과 일반화 능력을 가질 수 있다.

![앙상블 설명하는 Figure](image%202.png)

앙상블 설명하는 Figure

- 랜덤 포레스트에서는 다양한 앙상블 기법 중에서 배깅 기법을 사용한다.
  이는 주로 **모델의 분산(variance)을 줄이기 위해** 사용된다.
- 배깅은 훈련 데이터를 여러 번 샘플링하여 서로 다른 데이터셋을 만들고, 각 데이터셋으로 개별 모델을 학습한 뒤 예측 결과를 평균(또는 다수결)한다.
  이때, 복원추출방법을 사용하며 중복을 허용하기 때문에 단일 데이터가 여러번 선택될 수도 있다.
- 이런 불완전한 트리들은 작은 데이터 변화에도 예측이 크게 달라지는 high variance 모델이다.
  여러 개의 트리를 평균하면 서로 다른 오차가 상쇄되어 전체 분산이 감소하고, 더 안정적인 예측이 가능해진다.

## References

- https://mozenworld.tistory.com/entry/%EB%A8%B8%EC%8B%A0%EB%9F%AC%EB%8B%9D-%EB%AA%A8%EB%8D%B8-%EC%86%8C%EA%B0%9C-4-%EB%9E%9C%EB%8D%A4-%ED%8F%AC%EB%A0%88%EC%8A%A4%ED%8A%B8-Random-Forest
- https://everyday-joyful.tistory.com/entry/%EC%95%99%EC%83%81%EB%B8%94-RandomForestRegressor
- http://velog.io/@changhtun1/ensemble
- https://www.r-bloggers.com/2021/08/feature-subsampling-for-random-forest-regression/
