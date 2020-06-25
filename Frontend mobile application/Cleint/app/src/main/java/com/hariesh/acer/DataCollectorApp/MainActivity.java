package com.hariesh.acer.DataCollectorApp;

import android.Manifest;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.util.Patterns;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class MainActivity extends AppCompatActivity {

    EditText username;
    EditText password;
    EditText url;
    ImageButton login;
    String userId;
    private static final String MY_PREF_FILE = "com.DataCollectorApp.prefs";

    private static String[] PERMISSIONS = {
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
            Manifest.permission.INTERNET
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        login=(ImageButton)findViewById(R.id.button);
        username = (EditText)findViewById(R.id.editText3);
        password = (EditText)findViewById(R.id.editText2);
        url = (EditText)findViewById(R.id.editText);
        checkAndGetPermission();
        login.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String usernameStr = username.getText().toString();
                String passwordStr = password.getText().toString();
                String urlStr = url.getText().toString();

                if(isValidCredentials(usernameStr,passwordStr,urlStr)) {
                    JSONObject post_dict = new JSONObject();

                    try {
                        post_dict.put("email", usernameStr);
                        post_dict.put("password", passwordStr);

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    login.setEnabled(false);
                    Toast.makeText(getApplicationContext(), "Logging in Progress", Toast.LENGTH_SHORT).show();
                    new SendDataToServer(new AsyncResponse() {
                        @Override
                        public void processFinish(boolean responseState) {
                            if (responseState) {
                                login.setEnabled(true);
                                Intent itent = new Intent(MainActivity.this, ListContainer.class);
                                startActivity(itent);
                            } else {
                                Toast.makeText(getApplicationContext(), "Login Failed", Toast.LENGTH_LONG).show();
                                login.setEnabled(true);
                            }

                        }
                        @Override
                        public void ResponseParse(String S){
                            try {
                                Log.i("Response:",S);
                                JSONObject data = new JSONObject(S);
                                if(data.getBoolean("ok")) {
                                    userId = data.getString("userid");
                                    Toast.makeText(getApplicationContext(), "Logged in Successfully", Toast.LENGTH_SHORT).show();
                                    SharedPreferences.Editor prefs_editor = getSharedPreferences(MY_PREF_FILE, MODE_PRIVATE).edit();
                                    prefs_editor.putString("userid", userId);
                                    prefs_editor.apply();
                                    getLabels();

                                }
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                    }).execute(String.valueOf(post_dict), urlStr+"/user/login");

                }
            }
        });

    }

    private void getLabels()
    {
        Toast.makeText(getApplicationContext(), "Getting Data From Server.Please Wait", Toast.LENGTH_SHORT).show();
        JSONObject post_dict = new JSONObject();

        try {
            post_dict.put("questionName", "question1");

        } catch (JSONException e) {
            e.printStackTrace();
        }
        new SendDataToServer(new AsyncResponse() {
            @Override
            public void processFinish(boolean responseState) { }

            @Override
            public void ResponseParse(String S){
                try {
                    Log.i("Response:",S);
                    JSONObject data = new JSONObject(S);
                    if(data.getBoolean("ok")) {
                        SharedPreferences.Editor prefs_editor = getSharedPreferences(MY_PREF_FILE, MODE_PRIVATE).edit();
                        String x[] = (String[]) data.get("columns");
                        for (int i = 0; i < x.length; i++)
                            prefs_editor.putString("label" + (i + 1), x[i]);
                        prefs_editor.putInt("number", x.length);
                        prefs_editor.putString("url",url.getText().toString());
                        prefs_editor.apply();
                    }

                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }).execute(String.valueOf(post_dict), url.getText().toString()+"/post/show");
    }

    private void checkAndGetPermission()
    {
        if (ContextCompat.checkSelfPermission(getApplicationContext(),
                Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED
                || ContextCompat.checkSelfPermission(getApplicationContext(),
                Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED
                ||ContextCompat.checkSelfPermission(getApplicationContext(),
                Manifest.permission.INTERNET) != PackageManager.PERMISSION_GRANTED ) {

            ActivityCompat.requestPermissions(
                    this,
                    PERMISSIONS,
                    1
            );

            if (ContextCompat.checkSelfPermission(getApplicationContext(),
                    Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED
                    || ContextCompat.checkSelfPermission(getApplicationContext(),
                    Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED
                    ||ContextCompat.checkSelfPermission(getApplicationContext(),
                    Manifest.permission.INTERNET) != PackageManager.PERMISSION_GRANTED ){
                finish();
            }

        }
    }

    private boolean isValidCredentials(String usernameStr,String passwordStr,String urlStr) {
        boolean flag = true;
        boolean match = true;
        if (usernameStr.equals("")) {

            username.setError("Username Required");
            flag = false;
        }
        if (passwordStr.equals("")) {

            password.setError("Password Required");
            flag = false;
        }
        if (urlStr.equals("")) {

            url.setError("URL Required");
            flag = false;
        }
        else {
            Pattern p = Patterns.WEB_URL;
            Matcher m = p.matcher(urlStr.toLowerCase());
            match = m.matches();
            if(!match)
                url.setError("Enter Valid URL");
        }
        return flag&&match;
    }


}

