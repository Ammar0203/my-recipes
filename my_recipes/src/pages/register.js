import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonContent,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonPage,
  IonRouterLink,
  IonText,
} from "@ionic/react";
import Header from "../components/Header/Header";
import avatar from "./assets/images/avatar.png";
import "./styles/register.css";
import { Formik } from "formik";
import * as yup from "yup";
import { REGISTER_URL } from "../config/urls";
import axios from "../config/axios";
import { useContext, useState } from "react";
import { Redirect, useHistory } from "react-router";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const { setLoggedIn, setJwt, loggedIn } = useContext(AuthContext);

  const history = useHistory();

  const validationSchema = yup.object({
    name: yup.string().nullable().required("يجب عليك إدخال اسم المستخدم"),
    email: yup
      .string()
      .nullable()
      .email("يجب عليك إدخال بريد إلكتروني صحيح")
      .required("يجب عليك إدخال البريد الإلكتروني"),
    password: yup
      .string()
      .nullable()
      .min(5, "يجب عليك إدخال 5 محارف على الأقل")
      .required("يجب عليك إدخال كلمة مرور"),
  });

  const onSubmit = async (values) => {
    setShowLoading(true);
    try {
      console.log(axios.defaults);
      await axios.post(REGISTER_URL, values).then((res) => {
        Storage.set({
          key: "accessToken",
          value: res.data.accessToken,
        });
        setLoggedIn(true);
        setJwt(res.data.accessToken);
        setShowLoading(false);
        setShowAlert(true);
      });
    } catch (error) {
      if (error.response.status === 400) {
        setShowLoading(false);
        setShowErrorAlert(true);
      } else {
        console.log(error.message);
        setShowLoading(false);
      }
    }
  };

  if(loggedIn) {
    return (
      <Redirect to="/my-recipe/all-posts" />
    )
  }

  return (
    <IonPage>
      {showLoading ? (
        <IonLoading isOpen={showLoading} />
      ) : (
        <>
          <IonAlert
            isOpen={showAlert}
            header="تنبيه"
            subHeader="لقد تم تسجيل حسابك بالفعل"
            message="تم انشاء حسابك سوف يتم الانتقال الى حسابك"
            buttons={[
              {
                text: "موافق",
                handler: () => {
                  history.push("/my-recipe/all-posts");
                },
              },
            ]}
          />
          <IonAlert
            isOpen={showErrorAlert}
            header="تنبيه"
            subHeader="البريد الالكتروني مستخدم"
            message="هذا البريد الالكتروني مستخدم بالفعل فهل ترغب بتسجيل الدخول؟"
            buttons={[
              {
                text: "موافق",
                handler: () => {
                  history.push("/account/login");
                },
              },
              {
                text: "الغاء",
                role: "cancel",
              },
            ]}
          />
          <Header headerTitle="تسجيل مستخدم جديد" />
          <IonContent>
            <IonAvatar className="avatar">
              <IonImg src={avatar} />
            </IonAvatar>
            <Formik
              initialValues={{
                name: null,
                email: null,
                password: null,
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                onSubmit(values);
                resetForm({values: {
                  name: null,
                  email: null,
                  password: null,
                }})
              }}
            >
              {(formikProps) => (
                <form onSubmit={formikProps.handleSubmit}>
                  <IonItem>
                    <IonLabel color="warning" position="floating">
                      الاسم
                    </IonLabel>
                    <IonInput
                      name="name"
                      value={formikProps.values.name}
                      onIonChange={formikProps.handleChange}
                    />
                  </IonItem>
                  <IonText className="error">
                    {" "}
                    {formikProps.touched.name && formikProps.errors.name}{" "}
                  </IonText>
                  <IonItem>
                    <IonLabel color="warning" position="floating">
                      البريد الاكتروني
                    </IonLabel>
                    <IonInput
                      name="email"
                      value={formikProps.values.email}
                      onIonChange={formikProps.handleChange}
                    />
                  </IonItem>
                  <IonText className="error">
                    {" "}
                    {formikProps.touched.email && formikProps.errors.email}{" "}
                  </IonText>
                  <IonItem>
                    <IonLabel color="warning" position="floating">
                      كلمة المرور
                    </IonLabel>
                    <IonInput
                      name="password"
                      type="password"
                      value={formikProps.values.password}
                      onIonChange={formikProps.handleChange}
                    />
                  </IonItem>
                  <IonText className="error">
                    {" "}
                    {formikProps.touched.password &&
                      formikProps.errors.password}{" "}
                  </IonText>
                  <div className="ion-text-center btn">
                    <IonButton type="submit">انشاء حساب</IonButton>
                    <IonRouterLink
                      routerLink="/account/login"
                      color="warning"
                      className="router-link"
                    >
                      تسجيل الدخول
                    </IonRouterLink>
                  </div>
                </form>
              )}
            </Formik>
          </IonContent>
        </>
      )}
    </IonPage>
  );
};

export default Register;
