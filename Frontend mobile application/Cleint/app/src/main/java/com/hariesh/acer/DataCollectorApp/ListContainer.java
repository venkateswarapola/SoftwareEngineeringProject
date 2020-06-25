package com.hariesh.acer.DataCollectorApp;

import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ListView;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Set;

public class ListContainer extends AppCompatActivity {
    ListView listView;
    String userId;
    ArrayList<DataModel> dataModels;
    private CustomAdapter adapter;
    private static final String MY_PREF_FILE = "com.DataCollectorApp.prefs";
    private int number;
    String url;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_list_container);
        Button sendbutton=(Button)findViewById(R.id.send);
        listView = (ListView)findViewById(R.id.listview);

        dataModels = new ArrayList<>();
        addDataList();


        adapter = new CustomAdapter(dataModels, getApplicationContext());


        listView.setAdapter(adapter);
        sendbutton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Set<String> X= CustomAdapter.data_vals.keySet();
                JSONObject post_dict = new JSONObject();

                try {
                    post_dict.put("userId",userId);
                    post_dict.put("questionName", "question1");
                    post_dict.put("answers",X);

                } catch (JSONException e) {
                    e.printStackTrace();
                }
                new SendDataToServer(new AsyncResponse() {
                    @Override
                    public void processFinish(boolean responseState) {
                        if(!responseState)
                        {
                            Toast.makeText(getApplicationContext(), "Response Rejected", Toast.LENGTH_LONG).show();
                        }
                    }

                    @Override
                    public void ResponseParse(String S){
                        try {
                            Log.i("Response:",S);
                            JSONObject data = new JSONObject(S);
                            if(data.getBoolean("ok")) {
                                Toast.makeText(getApplicationContext(), "Response Saved Successfully", Toast.LENGTH_LONG).show();
                            }

                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }).execute(String.valueOf(post_dict), url+"/post/respond");
            }
        });

    }
    private void addDataList() {

        dataModels.clear();

        SharedPreferences prefs = getSharedPreferences(MY_PREF_FILE, MODE_PRIVATE);
        number = prefs.getInt("number",0);
        userId = prefs.getString("userid","");
        url = prefs.getString("url","");
        for(int i =1; i<=number;i++)
            dataModels.add(new DataModel(prefs.getString("label"+i,"")));

    }

}
