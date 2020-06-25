package com.hariesh.acer.DataCollectorApp;

import android.os.AsyncTask;
import android.util.Log;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.net.HttpURLConnection;
import java.net.URL;

public class SendDataToServer extends AsyncTask<String,String,String> {

    AsyncResponse callback = null;

    SendDataToServer(AsyncResponse AR)
    {
        callback = AR;
    }

    @Override
    protected String doInBackground(String... params) {
        String JsonData = params[0];
        String JsonResponse;
        String urlStr = params[1];
        HttpURLConnection urlConnection = null;
        BufferedReader reader = null;
        try {
            URL url = new URL(urlStr);
            urlConnection = (HttpURLConnection) url.openConnection();
            urlConnection.setDoOutput(true);

            urlConnection.setRequestMethod("POST");
            urlConnection.setRequestProperty("Content-Type", "application/json");
            urlConnection.setRequestProperty("Accept", "application/json");

            Writer writer = new BufferedWriter(new OutputStreamWriter(urlConnection.getOutputStream(), "UTF-8"));
            writer.write(JsonData);

            writer.close();
            InputStream inputStream = urlConnection.getInputStream();

            StringBuffer buffer = new StringBuffer();
            if (inputStream == null) {
                // Nothing to do.
                return null;
            }
            reader = new BufferedReader(new InputStreamReader(inputStream));

            String inputLine;
            while ((inputLine = reader.readLine()) != null)
                buffer.append(inputLine + "\n");
            if (buffer.length() == 0) {
                // Stream was empty. No point in parsing.
                return null;
            }
            JsonResponse = new String(buffer);
            return JsonResponse;



        } catch (Exception e) {
            e.printStackTrace();

        } finally {
            if (urlConnection != null) {
                urlConnection.disconnect();
            }
            if (reader != null) {
                try {
                    reader.close();
                } catch (final IOException e) {
                    Log.e("IOException", "Error closing stream", e);
                }
            }

        }
        return null;
    }


    @Override
    protected void onPostExecute(String s) {
        if(s == null)
        {
            callback.processFinish(false);

        }
        else
        {
            callback.ResponseParse(s);
            callback.processFinish(true);
        }
    }

}
