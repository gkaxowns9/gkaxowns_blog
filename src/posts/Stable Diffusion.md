# Stable Diffusion

생성일: 2025년 9월 11일 오후 2:55
상태: 정리 완료
태그: 파이썬, 딥러닝, 이미지 생성, Diffusion

🚧 이 페이지는 [illustrated-stable-diffusion](https://jalammar.github.io/illustrated-stable-diffusion/) 을 참고하여 작성됨

## Stable Diffusion 이란?

- Stable Diffusion은 확산(Diffusion) 모델 아키텍처를 기반으로 **이미지 생성**에 맞게 구성하여 제작한 **생성형 인공지능** 모델이다.
- 오늘은 이 Stable Diffusion에 대한 “제품 분석” 을 진행해 보고자 한다. (Stable Diffusion도 제품이고, 논문 ‘리뷰’니까 뭐 상관없겠지)
- 입력 값에 따라 text to img, img to img 등의 모델이 존재하지만 여기서는 text to img 모델만 설명하겠다.

## 기본적인 원리

- Stable Diffusion의 기본 원리는 Denoising이다. 랜덤하게 생성된 이미지 정보 Tensor에서 **Noise를 점진적으로 제거**하여 원하는 이미지를 만드는 것이다.
- 학습 시에 Diffusion 모델을 사용하여 원본 이미지에 가우시안 노이즈를 점진적으로 추가한다.
  생성 시에는 이 역 과정을 이용하여 노이즈를 제거하여 원본 이미지에 가까운 형식으로 만든다.
  (여기서 주의해야 할 점은 Diffusion 모델은 **Noise를 추가**한다.)

## 원리

- 위 기본적인 원리를 이해했다면 본격적인 원리를 알아보자
  먼저 Stable Diffusion 모델은 크게 3가지로 나눌 수 있다. 1. Text Encoding 모델 2. Diffusion (Reversed) 모델 3. Image Decoding 모델
- 각 모델의 원리를 천천히 알아보자

### Text Encoding 모델

- Text Encoding 모델의 기본적인 원리는 자언어를 Tensor 형식으로 변환하는 것이다.

![image.png](../img/image.png)

![image.png](../img/image%201.png)

![image.png](../img/image%202.png)

- 위의 실제 Stable Diffusion의 코드를 보면, prompt를 모델의 내장함수로 encode 하는 것을 볼 수 있다.
- 참고로 저 내장함수의 이름이 get_learned_conditioning 인데, 여기서 condition이란 **Diffusion 모델에 추가적인 제약이나 정보를 주는 것**으로 이미지에 Noise를 더하거나 제거할 때의 조건(condition)을 주는 값이다.

![[출처](https://ffighting.net/deep-learning-paper-review/diffusion-model/stable-diffusion/)](../img/897b433e-6cee-49a6-8aad-391738bfaa62.png)

[출처](https://ffighting.net/deep-learning-paper-review/diffusion-model/stable-diffusion/)

- 위 그림에서도 볼 수 있 듯, Diffusion 모델에 condition을 줌으로써 생성에 원하는 방향을 설정할 수 있게 된다.

### Diffusion (Reversed) 모델

- 기본적으로 확산 모델은 데이터에 가우시안 노이즈를 섞어 나간다. 이는 학습된 값이 아니라, 얼마나 Noise를 주었는지를 나타내는 index 값인 $t$ (timestep) 에 따라 정해진 수식에 맞게 노이즈를 더하는 방식이다.
  자세한 공식은 아래와 같다.

$$
q(x_t \mid x_0) = \sqrt{\alpha_t}\,x_0 + \sqrt{1-\alpha_t}\,\epsilon
$$

- 여기서 $\alpha_t$는 **원본인 $x_0$가 얼마나 유지될지**를 나타내는 값이고, $\epsilon$은 매번 **샘플링되는 랜덤 가우시안 노이즈**를 의미한다.
- 앞에서 설명한 condition은 정확하게 이 역과정에 사용되며, 노이즈를 제거하는 방향을 설정한다.
  즉, 노이즈가 섞인 이미지를 받아서 **노이즈를 예측하여 제거하는 과정에서 사용**된다는 이야기이다.
  해당 과정을 이해하기 위해서는 U-Net에 대해 이해해야 한다.
- U-Net은 U자 모양의 신경망으로, **노이즈에서 고품질 이미지를 점진적으로 생성하는 역할**을 담당하는 핵심이다.

![진짜 U자임;; [출처](https://ai-onespoon.tistory.com/entry/Stable-Diffusion-UNet-%EA%B5%AC%EC%A1%B0)](/img/u-net.png)

진짜 U자임;; [출처](https://ai-onespoon.tistory.com/entry/Stable-Diffusion-UNet-%EA%B5%AC%EC%A1%B0)

- 이제 U-Net을 사용하여 노이즈를 제거할 수 있다. 아래 구조를 참고하자.

![image.png](../img/image%203.png)

- 위에서 볼 수 있듯, U-Net을 활용하여 노이즈를 찾아내고, 이를 제거하여 점진적으로 노이즈를 제거하는 구조이다.
- 이제 Scheduler를 사용하여 이를 여러 번 진행하여 노이즈가 완전히 제거된 이미지를 얻을 수 있을 것이다.

![image.png](../img/image%204.png)

### Image Decoding 모델

- 이제 생성된 이미지 Tensor를 실제 이미지로 Decoding 해줄 차례이다. 아래 실제 코드를 보며 설명하겠다.

![image.png](../img/image%205.png)

- 먼저 노이즈가 제거된 sample을 내장함수로 decode한 후, Pillow 라이브러리를 통해 우리가 평소 사용하는 png 코덱으로 이를 변환해 준다.
- 그런 후, sample를 list에 저장하고 다시 반복한다. 앞에서 설명했던 노이즈를 제거하는 과정을 계속 반복하며 이를 png 코덱으로 변환한다. (여기서 주의해야 할 점은 png 코덱으로 변환한 데이터가 아닌, 생성하고 decode한 sample을 저장한다.
- 정해진 수 만큼 반복이 끝났다면, 저장하였던 list를 stack 함수로 Tensor로 재배열한다.
- 그런 후 이 전체 Tensor를 numpy list로 바꿔주고 다시 Pillow라이브러리를 사용하여 png 코덱으로 변환해 준다.
