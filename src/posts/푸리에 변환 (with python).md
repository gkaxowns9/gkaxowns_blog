# 푸리에 변환 (with python)

생성일: 2025년 6월 9일 오전 11:48
상태: 정리 완료
태그: 물리, 음향학, 음악, 적분, 푸리에, 파이썬

## 정의

- 시간이나 공간에 대한 [함수](https://ko.wikipedia.org/wiki/%ED%95%A8%EC%88%98)를 **시간 또는 공간 [주파수](https://ko.wikipedia.org/wiki/%EC%A3%BC%ED%8C%8C%EC%88%98) 성분으로 분해하는 변환**을 말한다.
  이를 이용하여 소리를 변환하여 시간에 대한 진폭을 나타냈던 함수를 주파수에 대한 진폭을 나타내는 함수로 변환할 수 있다.
- 푸리에 변환의 공식은 아래와 같다.

$$
G(\omega) = \int_{-\infin}^{\infin}x(t)e^{−iωt}dt


$$

- 공식에 쓰인 문자들을 설명하자면:
  - $\omega$ : 주파수
  - $t$ : 시간
  - $x(t)$ : 기존 시간에 대한 진폭 함수
  - $G(\omega)$ : 변환한 주파수에 대한 진폭 함수

## 푸리에 변환 구현

- `python`에서 푸리에 변환에 사용되는 적분을 구현하기 위해서 `numpy` 라이브러리에 포함된 `trapezoid` 함수를 사용해야 한다.
- `trapezoid` 함수는 적분할 함수와 어떤 변수에 대해 적분할 것 인지를 매개변수로 보내면 그 함수를 적분하여 준다.
  정확하게는 적분 값을 근사하는 것이지만, 디지털 환경에서는 함수의 연속적인 적분 값을 구할 수 없기에 이 방법이 최선이다.

### 푸리에 변환 함수 정의

- `trapezoid` 함수를 사용하여 앞에서 작성했던 푸리에 변환 공식을 코드로 작성하여 보자

```python
def fourier_transform(y, x, omega):
    integrand = y * np.exp(-1j * omega * x) # y에 e^−iωx 곱하기
    return np.trapezoid(integrand, x) # 곱한 함수를 x에 대해 적분
```

- 코드를 순차적으로 설명하자면
  1. 매개변수 $y$(위 공식에서는 $x(t)$), $x$(위 공식에서는 $t$), omega(위 공식에서는 $\omega$)를 받는다
  2. 함수 값 $y$에 $e^{−iωx}$를 곱해서 `intergrand` 변수에 넣는다.
  3. `trapezoid` 함수로 `intergrand` 변수에 저장한 피적분함수를 적분한다.

### 전체 코드 정리

- 위에서 푸리에 변환 공식을 활용한 함수를 작성했으니, 음악 파일을 불러와 푸리에 변환을 직접 시켜보자
- 여기에서는 128bpm의 어쿠스틱 기타 샘플을 가져와서 진행해보겠다.

```python
data, samplerate = sf.read('128-G#-Strum.wav') # 오디오 파일 읽기
if data.ndim > 1:  # 스테레오라면
    data = data[:, 0]  # 한 채널만 사용
t = np.linspace(0, len(data) / samplerate, len(data)) # 시간축 생성
```

- 그런다음 비교를 위해 `matplitlib` 를 활용해서 시간에 대한 진폭을 나타냈던 함수를 먼저 그려보자

```python
plt.subplot(2, 1, 1)
plt.plot(t, data) # 변환 전 신호 그리기
plt.xlabel('시간 (초)')
plt.ylabel('진폭')
plt.title('변환 전 신호')
```

- 그 다음 가져온 샘플을 푸리에 변환해 보자

```python
freqs = np.linspace(0, 2000, 500)
omega = 2 * np.pi * freqs
fourier = np.array([fourier_transform(data, t, w) for w in omega]) # 푸리에 변환 수행
```

- 변환한 그래프도 그려주면 끝이다.

```python
plt.subplot(2, 1, 2)
plt.plot(omega, np.abs(fourier)) # 변환 후 신호 그리기
plt.xlabel('주파수 (rad/s)')
plt.ylabel('진폭')
plt.title('변환 후 신호')

plt.tight_layout()
plt.show() # 그래프 표시
```

### 결과

- 위 코드를 실행시킨 결과, 아래와 같은 그래프를 볼 수 있었다.

![Figure_1.png](../img/Figure_1.png)

## 활용

- 이와 같이 적분을 이용한 푸리에 변환을 음악에 적용할 수 있다는 것을 알 수 있었다.
- 실제 음악 산업에서는 이를 이용하여 음악의 주파수 대역을 분석하여 어느 주파수 대역의 소리를 키울지 말지 등을 정하는 데 쓰인다.
